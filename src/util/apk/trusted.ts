/**
 * SHA-256 fingerprints of the certificates that sign official Kreate APKs.
 *
 * These are public values, not secrets. Get one with:
 *   apksigner verify --print-certs Kreate.apk          (line "Signer #1 certificate SHA-256 digest")
 *   keytool -list -v -keystore release.jks -alias <alias>   (line "SHA256:")
 *
 * If the signing key is ever rotated, ADD the new fingerprint; keep the old one
 * so older releases still verify.
 */
export interface TrustedSigner {
  label: string
  sha256: string
}

export const TRUSTED_SIGNERS: readonly TrustedSigner[] = [
  {
    label: 'Official releases',
    sha256: '1bd03a8de5df4dbd7faddb81b9f2aaf55681a584a93d6fb47e9a5ccc736ef7ac',
  },
]
