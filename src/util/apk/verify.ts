/**
 * Client-side APK signature verifier (APK Signature Scheme v2 / v3 / v3.1).
 *
 * Mirrors what Android's PackageManager and `apksigner verify` do:
 *  1. Locate the ZIP End of Central Directory and the APK Signing Block.
 *  2. For every signer of every present scheme:
 *     - verify each supported signature over the signer's "signed data" with its public key,
 *     - check the digest list and signature list name the same algorithms, in order,
 *     - recompute the chunked content digest of the whole file and compare,
 *     - check the first certificate's public key equals the signer's public key,
 *     - (v3) check the SDK ranges inside and outside the signed data agree.
 *  3. Pin trust: SHA-256 of every signer's certificate must be in the trusted list.
 *
 * Everything runs on WebCrypto (`crypto.subtle`), so nothing leaves the device.
 * v1 (JAR) signatures are intentionally not accepted on their own: a v1-only APK fails.
 *
 * Spec: https://source.android.com/docs/security/features/apksigning/v2
 *       https://source.android.com/docs/security/features/apksigning/v3
 */

export type VerifyResult =
  /** Every signature is valid and every signer is trusted. */
  | { status: 'valid'; schemes: string[]; fingerprints: string[] }
  /** Signatures are valid, but at least one signer is not in the trusted list. */
  | { status: 'untrusted'; schemes: string[]; fingerprints: string[] }
  /** The file is an APK but its signature is missing, broken, or doesn't match the content. */
  | { status: 'invalid'; reason: string }

export class ApkFormatError extends Error {}

class InvalidSignature extends Error {}

type Bytes = Uint8Array<ArrayBuffer>

const SIG_BLOCK_MAGIC = 'APK Sig Block 42'
const EOCD_SIG = 0x06054b50
const EOCD_MIN_SIZE = 22

const SCHEME_V2 = 0x7109871a
const SCHEME_V3 = 0xf05368c0
const SCHEME_V31 = 0x1b93ad61

/** v2 attribute: "a v3 (or newer) block must also be present" (anti-stripping). */
const V2_STRIPPING_PROTECTION_ATTR = 0xbeeff00d

const CHUNK_SIZE = 1024 * 1024

type Digest = 'SHA-256' | 'SHA-512'

interface SigAlgorithm {
  digest: Digest
  kind: 'RSA-PSS' | 'RSASSA-PKCS1-v1_5' | 'ECDSA'
}

/**
 * Supported signature algorithm IDs. Unknown IDs (DSA 0x0301, the verity variants
 * 0x0421/0x0423/0x0425) are skipped, as Android does for algorithms it can't use;
 * a signer still needs at least one supported algorithm to pass.
 */
const SIG_ALGORITHMS: Record<number, SigAlgorithm> = {
  0x0101: { kind: 'RSA-PSS', digest: 'SHA-256' },
  0x0102: { kind: 'RSA-PSS', digest: 'SHA-512' },
  0x0103: { kind: 'RSASSA-PKCS1-v1_5', digest: 'SHA-256' },
  0x0104: { kind: 'RSASSA-PKCS1-v1_5', digest: 'SHA-512' },
  0x0201: { kind: 'ECDSA', digest: 'SHA-256' },
  0x0202: { kind: 'ECDSA', digest: 'SHA-512' },
}


/* ------------------------------------------------------------------ */
/* Byte helpers                                                        */
/* ------------------------------------------------------------------ */

function bytesEqual(a: Bytes, b: Bytes): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

function hex(bytes: Bytes): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

/** Normalizes "AB:CD:..." / "abcd..." into lowercase hex without separators. */
export function normalizeFingerprint(fp: string): string {
  return fp.replace(/[^0-9a-fA-F]/g, '').toLowerCase()
}

/** Formats a hex fingerprint as "AB:CD:EF:...". */
export function formatFingerprint(fp: string): string {
  return normalizeFingerprint(fp).toUpperCase().match(/../g)?.join(':') ?? ''
}

/** Bounds-checked little-endian reader over a byte slice. */
class Reader {
  private pos = 0
  private readonly view: DataView
  readonly bytes: Bytes

  constructor(bytes: Bytes) {
    this.bytes = bytes
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  }

  get remaining(): number { return this.bytes.length - this.pos }

  u32(): number {
    if (this.remaining < 4) throw new InvalidSignature('Truncated signature data')
    const v = this.view.getUint32(this.pos, true)
    this.pos += 4
    return v
  }

  /** Reads a uint32-length-prefixed byte string. */
  lengthPrefixed(): Bytes {
    const len = this.u32()
    if (len > this.remaining) throw new InvalidSignature('Length prefix exceeds remaining data')
    const out = this.bytes.subarray(this.pos, this.pos + len)
    this.pos += len
    return out
  }

  /** Reads a length-prefixed sequence of length-prefixed items. */
  sequence(): Bytes[] {
    const r = new Reader(this.lengthPrefixed())
    const items: Bytes[] = []
    while (r.remaining > 0) items.push(r.lengthPrefixed())
    return items
  }
}


/* ------------------------------------------------------------------ */
/* Minimal DER parsing (certificate -> SubjectPublicKeyInfo)           */
/* ------------------------------------------------------------------ */

interface Tlv { tag: number; start: number; contentStart: number; end: number }

function readTlv(buf: Bytes, offset: number, limit: number): Tlv {
  if (offset + 2 > limit) throw new InvalidSignature('Malformed DER')
  const tag = buf[offset]
  let len = buf[offset + 1]
  let p = offset + 2
  if (len & 0x80) {
    const n = len & 0x7f
    if (n === 0 || n > 4 || p + n > limit) throw new InvalidSignature('Malformed DER length')
    len = 0
    for (let i = 0; i < n; i++) len = len * 256 + buf[p++]
  }
  if (p + len > limit) throw new InvalidSignature('DER element exceeds bounds')
  return { tag, start: offset, contentStart: p, end: p + len }
}

function derChildren(buf: Bytes, parent: Tlv): Tlv[] {
  const out: Tlv[] = []
  let p = parent.contentStart
  while (p < parent.end) {
    const t = readTlv(buf, p, parent.end)
    out.push(t)
    p = t.end
  }
  return out
}

/** Returns the raw DER bytes of the certificate's SubjectPublicKeyInfo. */
function certificateSpki(cert: Bytes): Bytes {
  const certSeq = readTlv(cert, 0, cert.length)
  if (certSeq.tag !== 0x30 || certSeq.end !== cert.length) throw new InvalidSignature('Malformed certificate')
  const tbs = derChildren(cert, certSeq)[0]
  if (!tbs || tbs.tag !== 0x30) throw new InvalidSignature('Malformed certificate')
  let fields = derChildren(cert, tbs)
  if (fields[0]?.tag === 0xa0) fields = fields.slice(1) // explicit [0] version
  // serialNumber, signature, issuer, validity, subject, subjectPublicKeyInfo
  const spki = fields[5]
  if (!spki || spki.tag !== 0x30) throw new InvalidSignature('Malformed certificate')
  return cert.subarray(spki.start, spki.end)
}

const OID_P256 = '2a8648ce3d030107'
const OID_P384 = '2b81040022'
const OID_P521 = '2b81040023'

/** Returns the named curve of an EC SubjectPublicKeyInfo. */
function ecCurve(spki: Bytes): { name: 'P-256' | 'P-384' | 'P-521'; size: number } {
  const seq = readTlv(spki, 0, spki.length)
  const algId = derChildren(spki, seq)[0]
  const params = algId && derChildren(spki, algId)[1]
  if (!params || params.tag !== 0x06) throw new InvalidSignature('Unsupported EC key')
  switch (hex(spki.subarray(params.contentStart, params.end))) {
    case OID_P256: return { name: 'P-256', size: 32 }
    case OID_P384: return { name: 'P-384', size: 48 }
    case OID_P521: return { name: 'P-521', size: 66 }
    default: throw new InvalidSignature('Unsupported EC curve')
  }
}

/** Converts a DER ECDSA signature (SEQUENCE { r, s }) into the raw r||s form WebCrypto expects. */
function ecdsaDerToRaw(der: Bytes, size: number): Bytes {
  const seq = readTlv(der, 0, der.length)
  const parts = seq.tag === 0x30 && seq.end === der.length ? derChildren(der, seq) : []
  if (parts.length !== 2 || parts.some(p => p.tag !== 0x02)) throw new InvalidSignature('Malformed ECDSA signature')
  const out = new Uint8Array(size * 2)
  parts.forEach((p, i) => {
    let int = der.subarray(p.contentStart, p.end)
    while (int.length > 1 && int[0] === 0) int = int.subarray(1)
    if (int.length > size) throw new InvalidSignature('Malformed ECDSA signature')
    out.set(int, (i + 1) * size - int.length)
  })
  return out
}


/* ------------------------------------------------------------------ */
/* ZIP / APK Signing Block layout                                      */
/* ------------------------------------------------------------------ */

interface ApkLayout {
  blockStart: number
  cdOffset: number
  eocdOffset: number
  /** id -> value of each pair inside the APK Signing Block. */
  pairs: Map<number, Bytes>
}

/** Finds the ZIP End of Central Directory record and the central directory it points to. */
export function locateCentralDirectory(apk: Bytes): { eocdOffset: number; cdOffset: number; cdSize: number } {
  const view = new DataView(apk.buffer, apk.byteOffset, apk.byteLength)

  // Scan backwards, requiring the comment length to reach EOF exactly.
  let eocdOffset = -1
  const maxComment = Math.min(0xffff, apk.length - EOCD_MIN_SIZE)
  for (let commentLen = 0; commentLen <= maxComment; commentLen++) {
    const pos = apk.length - EOCD_MIN_SIZE - commentLen
    if (view.getUint32(pos, true) === EOCD_SIG && view.getUint16(pos + 20, true) === commentLen) {
      eocdOffset = pos
      break
    }
  }
  if (eocdOffset < 0) throw new ApkFormatError('Not an APK file (no ZIP directory found)')

  const cdSize = view.getUint32(eocdOffset + 12, true)
  const cdOffset = view.getUint32(eocdOffset + 16, true)
  if (cdOffset === 0xffffffff || cdSize === 0xffffffff) throw new ApkFormatError('ZIP64 APKs are not supported')
  if (cdOffset + cdSize !== eocdOffset) throw new ApkFormatError('Malformed APK (central directory is not followed by its end record)')

  return { eocdOffset, cdOffset, cdSize }
}

function readLayout(apk: Bytes): ApkLayout {
  const view = new DataView(apk.buffer, apk.byteOffset, apk.byteLength)
  const { eocdOffset, cdOffset } = locateCentralDirectory(apk)

  // APK Signing Block footer: uint64 size, then 16-byte magic, right before the central directory.
  if (cdOffset < 32) throw new InvalidSignature('APK is not signed with signature scheme v2 or newer')
  const magic = new TextDecoder('latin1').decode(apk.subarray(cdOffset - 16, cdOffset))
  if (magic !== SIG_BLOCK_MAGIC) throw new InvalidSignature('APK is not signed with signature scheme v2 or newer')

  const footerSize = view.getBigUint64(cdOffset - 24, true)
  if (footerSize < 24n || footerSize > BigInt(cdOffset - 8)) throw new InvalidSignature('Malformed APK Signing Block')
  const blockStart = cdOffset - Number(footerSize) - 8
  if (view.getBigUint64(blockStart, true) !== footerSize) throw new InvalidSignature('Malformed APK Signing Block (size mismatch)')

  const pairs = new Map<number, Bytes>()
  let p = blockStart + 8
  const pairsEnd = cdOffset - 24
  while (p < pairsEnd) {
    if (p + 8 > pairsEnd) throw new InvalidSignature('Malformed APK Signing Block')
    const len = view.getBigUint64(p, true)
    if (len < 4n || len > BigInt(pairsEnd - p - 8)) throw new InvalidSignature('Malformed APK Signing Block entry')
    const id = view.getUint32(p + 8, true)
    const value = apk.subarray(p + 12, p + 8 + Number(len))
    if (pairs.has(id)) throw new InvalidSignature('Duplicate entry in APK Signing Block')
    pairs.set(id, value)
    p += 8 + Number(len)
  }

  return { blockStart, cdOffset, eocdOffset, pairs }
}


/* ------------------------------------------------------------------ */
/* Content digest (1 MiB chunked)                                      */
/* ------------------------------------------------------------------ */

async function chunkedDigest(apk: Bytes, layout: ApkLayout, algorithm: Digest): Promise<Bytes> {
  // The EOCD is hashed with its "central directory offset" pointing at the signing block.
  const eocd = apk.slice(layout.eocdOffset)
  new DataView(eocd.buffer).setUint32(16, layout.blockStart, true)

  const sections = [
    apk.subarray(0, layout.blockStart),
    apk.subarray(layout.cdOffset, layout.eocdOffset),
    eocd,
  ]

  const chunks: Bytes[] = []
  for (const section of sections)
    for (let off = 0; off < section.length; off += CHUNK_SIZE)
      chunks.push(section.subarray(off, Math.min(off + CHUNK_SIZE, section.length)))

  const chunkDigests = await Promise.all(chunks.map(chunk => {
    const input = new Uint8Array(5 + chunk.length)
    input[0] = 0xa5
    new DataView(input.buffer).setUint32(1, chunk.length, true)
    input.set(chunk, 5)
    return crypto.subtle.digest(algorithm, input)
  }))

  const digestSize = algorithm === 'SHA-256' ? 32 : 64
  const top = new Uint8Array(5 + chunks.length * digestSize)
  top[0] = 0x5a
  new DataView(top.buffer).setUint32(1, chunks.length, true)
  chunkDigests.forEach((d, i) => top.set(new Uint8Array(d), 5 + i * digestSize))

  return new Uint8Array(await crypto.subtle.digest(algorithm, top))
}


/* ------------------------------------------------------------------ */
/* Signer verification                                                 */
/* ------------------------------------------------------------------ */

async function verifySignature(alg: SigAlgorithm, spki: Bytes, signature: Bytes, data: Bytes): Promise<boolean> {
  try {
    switch (alg.kind) {
      case 'RSA-PSS': {
        const key = await crypto.subtle.importKey('spki', spki, { name: 'RSA-PSS', hash: alg.digest }, false, ['verify'])
        const saltLength = alg.digest === 'SHA-256' ? 32 : 64
        return await crypto.subtle.verify({ name: 'RSA-PSS', saltLength }, key, signature, data)
      }
      case 'RSASSA-PKCS1-v1_5': {
        const key = await crypto.subtle.importKey('spki', spki, { name: 'RSASSA-PKCS1-v1_5', hash: alg.digest }, false, ['verify'])
        return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data)
      }
      case 'ECDSA': {
        const curve = ecCurve(spki)
        const key = await crypto.subtle.importKey('spki', spki, { name: 'ECDSA', namedCurve: curve.name }, false, ['verify'])
        return await crypto.subtle.verify({ name: 'ECDSA', hash: alg.digest }, key, ecdsaDerToRaw(signature, curve.size), data)
      }
    }
  } catch (e) {
    if (e instanceof InvalidSignature) throw e
    throw new InvalidSignature('Signer public key could not be used')
  }
}

interface SignerInfo {
  certificate: Bytes
  attributes: Map<number, Bytes>
}

async function verifySigner(
  signerBytes: Bytes,
  isV3: boolean,
  contentDigest: (d: Digest) => Promise<Bytes>,
): Promise<SignerInfo> {
  const signer = new Reader(signerBytes)
  const signedDataBytes = signer.lengthPrefixed()
  const outerMinSdk = isV3 ? signer.u32() : 0
  const outerMaxSdk = isV3 ? signer.u32() : 0
  const signatures = signer.sequence().map(s => {
    const r = new Reader(s)
    return { algId: r.u32(), signature: r.lengthPrefixed() }
  })
  const publicKey = signer.lengthPrefixed()

  const signedData = new Reader(signedDataBytes)
  const digests = signedData.sequence().map(d => {
    const r = new Reader(d)
    return { algId: r.u32(), digest: r.lengthPrefixed() }
  })
  const certificates = signedData.sequence()
  if (isV3) {
    const minSdk = signedData.u32()
    const maxSdk = signedData.u32()
    if (minSdk !== outerMinSdk || maxSdk !== outerMaxSdk)
      throw new InvalidSignature('Signer SDK range does not match its signed data')
  }
  const attributes = new Map<number, Bytes>()
  for (const a of signedData.sequence()) {
    const r = new Reader(a)
    attributes.set(r.u32(), r.bytes.subarray(4))
  }

  if (signatures.length === 0) throw new InvalidSignature('Signer has no signatures')

  // The algorithm lists in "digests" and "signatures" must be identical and in the same order.
  if (digests.length !== signatures.length || digests.some((d, i) => d.algId !== signatures[i].algId))
    throw new InvalidSignature('Signature and digest algorithm lists differ')

  const supported = signatures.filter(s => s.algId in SIG_ALGORITHMS)
  if (supported.length === 0) throw new InvalidSignature('APK uses an unsupported signature algorithm')

  for (const { algId, signature } of supported) {
    const alg = SIG_ALGORITHMS[algId]
    if (!(await verifySignature(alg, publicKey, signature, signedDataBytes)))
      throw new InvalidSignature('Signature does not verify')

    const expected = digests.find(d => d.algId === algId)!.digest
    if (!bytesEqual(await contentDigest(alg.digest), expected))
      throw new InvalidSignature('APK content was modified after signing')
  }

  if (certificates.length === 0) throw new InvalidSignature('Signer has no certificate')
  if (!bytesEqual(certificateSpki(certificates[0]), publicKey))
    throw new InvalidSignature('Certificate does not match signing key')

  return { certificate: certificates[0], attributes }
}

async function verifyScheme(
  value: Bytes,
  isV3: boolean,
  contentDigest: (d: Digest) => Promise<Bytes>,
): Promise<SignerInfo[]> {
  const signers = new Reader(value).sequence()
  if (signers.length === 0) throw new InvalidSignature('Signature block has no signers')
  const out: SignerInfo[] = []
  for (const s of signers) out.push(await verifySigner(s, isV3, contentDigest))
  return out
}


/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

/**
 * Verifies an APK.
 *
 * @param apk                 Full APK file contents.
 * @param trustedFingerprints SHA-256 fingerprints of trusted signing certificates (any format: "AB:CD..." or "abcd...").
 * @throws ApkFormatError     If the file isn't a usable APK/ZIP at all.
 */
export async function verifyApk(apk: Bytes, trustedFingerprints: readonly string[]): Promise<VerifyResult> {
  const trusted = new Set(trustedFingerprints.map(normalizeFingerprint))

  try {
    const layout = readLayout(apk)

    const digestCache = new Map<Digest, Promise<Bytes>>()
    const contentDigest = (d: Digest) => {
      if (!digestCache.has(d)) digestCache.set(d, chunkedDigest(apk, layout, d))
      return digestCache.get(d)!
    }

    const present = [
      { id: SCHEME_V2, name: 'v2', isV3: false },
      { id: SCHEME_V3, name: 'v3', isV3: true },
      { id: SCHEME_V31, name: 'v3.1', isV3: true },
    ].filter(s => layout.pairs.has(s.id))
    if (present.length === 0) throw new InvalidSignature('APK is not signed with signature scheme v2 or newer')

    const schemes: string[] = []
    const fingerprints = new Set<string>()
    for (const scheme of present) {
      const signers = await verifyScheme(layout.pairs.get(scheme.id)!, scheme.isV3, contentDigest)

      // A v2 signer may declare that a v3 block must exist; if it's gone, the APK was stripped.
      if (scheme.id === SCHEME_V2) {
        for (const s of signers) {
          const attr = s.attributes.get(V2_STRIPPING_PROTECTION_ATTR)
          if (attr && attr.length >= 4 && new DataView(attr.buffer, attr.byteOffset).getUint32(0, true) >= 3
              && !layout.pairs.has(SCHEME_V3))
            throw new InvalidSignature('APK v3 signature was stripped')
        }
      }

      for (const s of signers)
        fingerprints.add(hex(new Uint8Array(await crypto.subtle.digest('SHA-256', s.certificate))))
      schemes.push(scheme.name)
    }

    const fps = [...fingerprints]
    const allTrusted = fps.every(fp => trusted.has(fp))
    return { status: allTrusted ? 'valid' : 'untrusted', schemes, fingerprints: fps }
  } catch (e) {
    if (e instanceof InvalidSignature) return { status: 'invalid', reason: e.message }
    throw e
  }
}
