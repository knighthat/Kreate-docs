import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';

import { verifyApk, formatFingerprint, normalizeFingerprint, ApkFormatError } from '@utils/apk/verify';
import { inspectApk, type ApkInfo } from '@utils/apk/inspect';
import { TRUSTED_SIGNERS } from '@utils/apk/trusted';
import { APP_NAME } from '@site/constants';
import ApkDetails from './_ApkDetails';
import ScanReport from './_ScanReport';
import styles from './styles.module.css';


const MAX_SIZE = 512 * 1024 * 1024;

type State =
  | { kind: 'idle' }
  | { kind: 'checking'; fileName: string }
  | { kind: 'valid'; fileName: string; signer: string; fingerprint: string; sha256: string; info?: ApkInfo }
  | { kind: 'invalid'; fileName: string; reason: string; fingerprint?: string };


async function check(file: File): Promise<State> {
  const fileName = file.name;
  if (file.size > MAX_SIZE)
    return { kind: 'invalid', fileName, reason: 'This file is too large to be a Kreate APK.' };

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await verifyApk(bytes, TRUSTED_SIGNERS.map(s => s.sha256));

    switch (result.status) {
      case 'valid': {
        const fp = result.fingerprints[0];
        const signer = TRUSTED_SIGNERS.find(s => normalizeFingerprint(s.sha256) === fp)!;
        // Only read details from verified APKs: the signature covers every byte, so they're authentic.
        let info: ApkInfo | undefined;
        try {
          info = await inspectApk(bytes);
        } catch (e) {
          console.warn('Could not read APK details:', e);
        }
        // Hash of the whole file, used to look up the VirusTotal report.
        const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
        return { kind: 'valid', fileName, signer: signer.label, fingerprint: fp, sha256, info };
      }
      case 'untrusted':
        return {
          kind: 'invalid', fileName,
          reason: `The signature is intact, but it was not signed by ${APP_NAME}'s developers. Do not install it.`,
          fingerprint: result.fingerprints.find(fp => !TRUSTED_SIGNERS.some(s => normalizeFingerprint(s.sha256) === fp)),
        };
      case 'invalid':
        return { kind: 'invalid', fileName, reason: `${result.reason}. Do not install it.` };
    }
  } catch (e) {
    if (e instanceof ApkFormatError)
      return { kind: 'invalid', fileName, reason: `${e.message}.` };
    console.error(e);
    return { kind: 'invalid', fileName, reason: 'This file could not be checked. Your browser may not support it.' };
  }
}


function Tick(): ReactNode {
  return (
    <svg className={clsx(styles.mark, styles.tick)} viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r="24" />
      <path d="M15 27 l8 8 l15 -17" />
    </svg>
  );
}

function Cross(): ReactNode {
  return (
    <svg className={clsx(styles.mark, styles.cross)} viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r="24" />
      <path d="M17 17 L35 35 M35 17 L17 35" />
    </svg>
  );
}


export default function Verify(): ReactNode {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dropping a file outside the zone would make the browser open/download it.
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    window.addEventListener('dragover', block);
    window.addEventListener('drop', block);
    return () => {
      window.removeEventListener('dragover', block);
      window.removeEventListener('drop', block);
    };
  }, []);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setState({ kind: 'checking', fileName: file.name });
    setState(await check(file));
  }, []);

  const busy = state.kind === 'checking';
  const openPicker = () => { if (!busy) inputRef.current?.click(); };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!busy) handleFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setState({ kind: 'idle' });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Layout
      title="Verify APK"
      description={`Check that a ${APP_NAME} APK is genuine and unmodified. The file is checked in your browser and never uploaded.`}
    >
      <main className={clsx('container', styles.page)}>
        <h1>Verify your APK</h1>
        <p className={styles.lead}>
          Check that a {APP_NAME} APK was signed by its developers and hasn't been modified.
          Everything runs in your browser. <strong>Your file is never uploaded.</strong>
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".apk,application/vnd.android.package-archive"
          hidden
          onChange={e => handleFile(e.target.files?.[0])}
        />

        <div
          className={clsx(styles.zone, styles[state.kind], dragging && styles.dragging)}
          role="button"
          tabIndex={busy ? -1 : 0}
          aria-busy={busy}
          aria-label="Choose or drop an APK file to verify"
          onClick={state.kind === 'idle' ? openPicker : undefined}
          onKeyDown={e => { if (state.kind === 'idle' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openPicker(); } }}
          onDragOver={e => { e.preventDefault(); if (!busy) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div aria-live="polite" className={styles.zoneContent}>
            {state.kind === 'idle' && (
              <>
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 16V4m0 0-5 5m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                </svg>
                <div className={styles.zoneTitle}>{dragging ? 'Drop it here' : 'Drag & drop an APK here'}</div>
                <div className={styles.zoneHint}>or click to choose a file</div>
              </>
            )}

            {state.kind === 'checking' && (
              <>
                <div className={styles.spinner} aria-hidden="true" />
                <div className={styles.zoneTitle}>Checking signature…</div>
                <div className={styles.fileName}>{state.fileName}</div>
              </>
            )}

            {state.kind === 'valid' && (
              <>
                <Tick />
                <div className={styles.zoneTitle}>
                  Genuine {APP_NAME} APK{state.info?.versionName && ` · ${state.info.versionName}`}
                </div>
                <div className={styles.fileName}>{state.fileName}</div>
                <div className={styles.zoneHint}>Signed by {state.signer}. Safe to install.</div>
              </>
            )}

            {state.kind === 'invalid' && (
              <>
                <Cross />
                <div className={styles.zoneTitle}>Not a genuine {APP_NAME} APK</div>
                <div className={styles.fileName}>{state.fileName}</div>
                <div className={styles.zoneHint}>{state.reason}</div>
              </>
            )}
          </div>
        </div>

        {(state.kind === 'valid' || state.kind === 'invalid') && (
          <div className={styles.actions}>
            <button className="button button--primary" onClick={reset}>Check another file</button>
            {state.fingerprint && (
              <p className={styles.fingerprint}>
                Signer certificate SHA-256:<br />
                <code>{formatFingerprint(state.fingerprint)}</code>
              </p>
            )}
          </div>
        )}

        {/* Only genuine APKs are looked up; nothing about other files leaves the device. */}
        {state.kind === 'valid' && (
          <ScanReport
            sha256={state.sha256}
            // FOSS builds are published by IzzyOnDroid: "2.2.5-izzy" up to now, "<version>+foss" from now on.
            isIzzy={/(-izzy|\+foss)$/i.test(state.info?.versionName ?? '')}
          />
        )}
        {state.kind === 'valid' && state.info && <ApkDetails info={state.info} />}

        <details className={styles.details}>
          <summary>Official signing certificate</summary>
          <p>
            Official APKs from GitHub and IzzyOnDroid are signed with this certificate.
            You can also check an APK yourself with <code>apksigner verify --print-certs Kreate.apk</code>.
          </p>
          <ul>
            {TRUSTED_SIGNERS.map(s => (
              <li key={s.sha256}>
                <strong>{s.label}</strong><br />
                <code className={styles.fpCode}>{formatFingerprint(s.sha256)}</code>
              </li>
            ))}
          </ul>
        </details>
      </main>
    </Layout>
  );
}
