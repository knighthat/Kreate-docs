/**
 * Reads build information out of an APK, entirely client-side.
 *
 * Only call this on an APK whose signature has already been verified: the v2+ signature
 * covers every byte of the ZIP, so everything read here is then authentic too.
 *
 * Each field is extracted independently; a field that can't be read is left undefined
 * instead of failing the whole inspection.
 */
import { locateCentralDirectory } from './verify'

type Bytes = Uint8Array<ArrayBuffer>

export interface Permission {
  name: string
  /** Only requested up to (and including) this SDK level. */
  maxSdk?: number
}

export interface Library {
  name: string
  version: string
}

export interface ApkInfo {
  packageName?: string
  versionName?: string
  versionCode?: number
  minSdk?: number | string
  targetSdk?: number | string
  compileSdk?: number
  permissions?: Permission[]
  /** Native-code ABIs; empty means no native code (runs on any CPU). */
  abis: string[]
  gitCommit?: string
  agpVersion?: string
  gradleVersion?: string
  kotlinVersion?: string
  libraries: Library[]
}

/** Upper bound for any single decompressed entry we read (guards against zip bombs). */
const MAX_ENTRY_SIZE = 8 * 1024 * 1024


/* ------------------------------------------------------------------ */
/* ZIP entries                                                         */
/* ------------------------------------------------------------------ */

interface ZipEntry {
  name: string
  method: number
  compressedSize: number
  uncompressedSize: number
  localHeaderOffset: number
}

function listEntries(apk: Bytes): ZipEntry[] {
  const view = new DataView(apk.buffer, apk.byteOffset, apk.byteLength)
  const { cdOffset, eocdOffset } = locateCentralDirectory(apk)
  const utf8 = new TextDecoder()
  const entries: ZipEntry[] = []

  let p = cdOffset
  while (p + 46 <= eocdOffset && view.getUint32(p, true) === 0x02014b50) {
    const nameLen = view.getUint16(p + 28, true)
    const extraLen = view.getUint16(p + 30, true)
    const commentLen = view.getUint16(p + 32, true)
    entries.push({
      method: view.getUint16(p + 10, true),
      compressedSize: view.getUint32(p + 20, true),
      uncompressedSize: view.getUint32(p + 24, true),
      localHeaderOffset: view.getUint32(p + 42, true),
      name: utf8.decode(apk.subarray(p + 46, p + 46 + nameLen)),
    })
    p += 46 + nameLen + extraLen + commentLen
  }
  return entries
}

async function inflateRaw(data: Bytes, limit: number): Promise<Bytes> {
  const reader = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.length
    if (total > limit) {
      await reader.cancel()
      throw new Error('Entry too large')
    }
    chunks.push(value)
  }
  const out = new Uint8Array(total)
  let off = 0
  for (const c of chunks) { out.set(c, off); off += c.length }
  return out
}

async function readEntry(apk: Bytes, entry: ZipEntry): Promise<Bytes> {
  if (entry.uncompressedSize > MAX_ENTRY_SIZE) throw new Error('Entry too large')
  const view = new DataView(apk.buffer, apk.byteOffset, apk.byteLength)
  const h = entry.localHeaderOffset
  if (view.getUint32(h, true) !== 0x04034b50) throw new Error('Bad local header')
  const start = h + 30 + view.getUint16(h + 26, true) + view.getUint16(h + 28, true)
  const data = apk.subarray(start, start + entry.compressedSize)
  if (data.length !== entry.compressedSize) throw new Error('Truncated entry')

  switch (entry.method) {
    case 0: return data
    case 8: return inflateRaw(data, MAX_ENTRY_SIZE)
    default: throw new Error('Unsupported compression')
  }
}


/* ------------------------------------------------------------------ */
/* Binary XML (AndroidManifest.xml)                                    */
/* ------------------------------------------------------------------ */

const RES_XML = 0x0003
const RES_STRING_POOL = 0x0001
const RES_XML_RESOURCE_MAP = 0x0180
const RES_XML_START_ELEMENT = 0x0102
const RES_XML_END_ELEMENT = 0x0103

const TYPE_STRING = 0x03
const TYPE_INT_DEC = 0x10
const TYPE_INT_HEX = 0x11

/** android:* attributes are identified by resource ID; their names may be stripped. */
const ANDROID_ATTRS: Record<number, string> = {
  0x01010003: 'name',
  0x0101020c: 'minSdkVersion',
  0x0101021b: 'versionCode',
  0x0101021c: 'versionName',
  0x01010270: 'targetSdkVersion',
  0x01010271: 'maxSdkVersion',
  0x01010572: 'compileSdkVersion',
}

type AttrValue = string | number | undefined

function parseStringPool(buf: Bytes, view: DataView, p: number): (i: number) => string {
  const headerSize = view.getUint16(p + 2, true)
  const count = view.getUint32(p + 8, true)
  const isUtf8 = (view.getUint32(p + 16, true) & 0x100) !== 0
  const stringsStart = p + view.getUint32(p + 20, true)
  const utf8 = new TextDecoder('utf-8')
  const utf16 = new TextDecoder('utf-16le')
  const cache = new Map<number, string>()

  return (i: number) => {
    if (i < 0 || i >= count) return ''
    const cached = cache.get(i)
    if (cached !== undefined) return cached

    let o = stringsStart + view.getUint32(p + headerSize + i * 4, true)
    let s: string
    if (isUtf8) {
      o += (buf[o] & 0x80) ? 2 : 1 // UTF-16 length, unused
      let len = buf[o]
      if (len & 0x80) { len = ((len & 0x7f) << 8) | buf[o + 1]; o += 2 } else o += 1
      s = utf8.decode(buf.subarray(o, o + len))
    } else {
      let len = view.getUint16(o, true)
      if (len & 0x8000) { len = ((len & 0x7fff) << 16) | view.getUint16(o + 2, true); o += 4 } else o += 2
      s = utf16.decode(buf.subarray(o, o + len * 2))
    }
    cache.set(i, s)
    return s
  }
}

interface Manifest {
  packageName?: string
  versionName?: string
  versionCode?: number
  minSdk?: number | string
  targetSdk?: number | string
  compileSdk?: number
  permissions: Permission[]
}

function parseManifest(buf: Bytes): Manifest {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  if (view.getUint16(0, true) !== RES_XML) throw new Error('Not a binary XML file')
  const end = Math.min(view.getUint32(4, true), buf.length)

  let str: (i: number) => string = () => ''
  let resIds: number[] = []
  const manifest: Manifest = { permissions: [] }
  let depth = 0
  let sawSdk = false

  let p = view.getUint16(2, true)
  while (p + 8 <= end) {
    const type = view.getUint16(p, true)
    const headerSize = view.getUint16(p + 2, true)
    const size = view.getUint32(p + 4, true)
    if (size < 8 || p + size > end) break

    if (type === RES_STRING_POOL) {
      str = parseStringPool(buf, view, p)
    } else if (type === RES_XML_RESOURCE_MAP) {
      resIds = []
      for (let o = p + headerSize; o + 4 <= p + size; o += 4) resIds.push(view.getUint32(o, true))
    } else if (type === RES_XML_START_ELEMENT) {
      const ext = p + headerSize
      const element = str(view.getUint32(ext + 4, true))
      const attrStart = view.getUint16(ext + 8, true)
      const attrSize = view.getUint16(ext + 10, true)
      const attrCount = view.getUint16(ext + 12, true)

      const attrs = new Map<string, AttrValue>()
      for (let i = 0; i < attrCount; i++) {
        const a = ext + attrStart + i * attrSize
        const nameIdx = view.getUint32(a + 4, true)
        const name = ANDROID_ATTRS[resIds[nameIdx]] ?? str(nameIdx)
        const dataType = buf[a + 15]
        const data = view.getUint32(a + 16, true)
        let value: AttrValue
        if (dataType === TYPE_STRING) value = str(data)
        else if (dataType === TYPE_INT_DEC || dataType === TYPE_INT_HEX) value = data | 0
        attrs.set(name, value)
      }

      const num = (k: string) => typeof attrs.get(k) === 'number' ? attrs.get(k) as number : undefined
      const sdk = (k: string) => attrs.get(k)

      if (depth === 0 && element === 'manifest') {
        const pkg = attrs.get('package')
        const vn = attrs.get('versionName')
        if (typeof pkg === 'string') manifest.packageName = pkg
        if (typeof vn === 'string') manifest.versionName = vn
        manifest.versionCode = num('versionCode')
        manifest.compileSdk = num('compileSdkVersion')
      } else if (depth === 1 && element === 'uses-sdk') {
        sawSdk = true
        manifest.minSdk = sdk('minSdkVersion')
        manifest.targetSdk = sdk('targetSdkVersion')
      } else if (depth === 1 && (element === 'uses-permission' || element === 'uses-permission-sdk-23')) {
        const name = attrs.get('name')
        if (typeof name === 'string') manifest.permissions.push({ name, maxSdk: num('maxSdkVersion') })
      }
      depth++
    } else if (type === RES_XML_END_ELEMENT) {
      depth--
    }
    p += size
  }

  // Android defaults: minSdk = 1, targetSdk = minSdk.
  if (sawSdk || manifest.packageName) {
    manifest.minSdk ??= 1
    manifest.targetSdk ??= manifest.minSdk
  }
  return manifest
}


/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

/** "androidx.compose.ui_ui" -> "androidx.compose.ui:ui"; "kotlinx_coroutines_core" stays as is. */
function libraryName(fileStem: string): string {
  const i = fileStem.indexOf('_')
  return i > 0 && fileStem.slice(0, i).includes('.') ? `${fileStem.slice(0, i)}:${fileStem.slice(i + 1)}` : fileStem
}

/** Runs `fn`, returning undefined (and logging) if it throws. */
async function attempt<T>(what: string, fn: () => Promise<T> | T): Promise<T | undefined> {
  try {
    return await fn()
  } catch (e) {
    console.warn(`Could not read ${what}:`, e)
    return undefined
  }
}

export async function inspectApk(apk: Bytes): Promise<ApkInfo> {
  const entries = listEntries(apk)
  const byName = new Map(entries.map(e => [e.name, e]))
  const text = async (name: string) => {
    const e = byName.get(name)
    return e ? new TextDecoder().decode(await readEntry(apk, e)) : undefined
  }

  const info: ApkInfo = { abis: [], libraries: [] }

  // Manifest
  const manifest = await attempt('AndroidManifest.xml', async () => {
    const e = byName.get('AndroidManifest.xml')
    return e ? parseManifest(await readEntry(apk, e)) : undefined
  })
  if (manifest) Object.assign(info, manifest)

  // CPU architectures: lib/<abi>/<file>
  info.abis = [...new Set(entries
    .map(e => e.name.split('/'))
    .filter(parts => parts.length >= 3 && parts[0] === 'lib' && parts[1])
    .map(parts => parts[1]))].sort()

  // Git commit
  info.gitCommit = await attempt('version-control-info', async () =>
    (await text('META-INF/version-control-info.textproto'))?.match(/revision:\s*"([0-9a-fA-F]{7,64})"/)?.[1].toLowerCase())

  // Android Gradle Plugin
  info.agpVersion = await attempt('app-metadata.properties', async () =>
    (await text('META-INF/com/android/build/gradle/app-metadata.properties'))
      ?.match(/^androidGradlePluginVersion=(.+)$/m)?.[1].trim())

  // Gradle & Kotlin
  await attempt('kotlin-tooling-metadata.json', async () => {
    const raw = await text('kotlin-tooling-metadata.json')
    if (!raw) return
    const json = JSON.parse(raw) as Record<string, unknown>
    if (json.buildSystem === 'Gradle' && typeof json.buildSystemVersion === 'string') info.gradleVersion = json.buildSystemVersion
    if (typeof json.buildPluginVersion === 'string') info.kotlinVersion = json.buildPluginVersion
  })

  // Library versions: META-INF/<group>_<artifact>.version
  for (const e of entries) {
    const m = e.name.match(/^META-INF\/([^/]+)\.version$/)
    if (!m) continue
    const version = await attempt(e.name, async () => (await text(e.name))?.trim())
    if (version && version.length <= 64) info.libraries.push({ name: libraryName(m[1]), version })
  }
  info.libraries.sort((a, b) => a.name.localeCompare(b.name))

  return info
}
