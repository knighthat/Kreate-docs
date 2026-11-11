import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';

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
    return { kind: 'invalid', fileName, reason: translate({ id: 'verify.reason.tooLarge', message: 'This file is too large to be a {app} APK.' }, { app: APP_NAME }) };

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
        return { kind: 'valid', fileName, signer: signer.label(), fingerprint: fp, sha256, info };
      }
      case 'untrusted':
        return {
          kind: 'invalid', fileName,
          reason: translate({ id: 'verify.reason.untrusted', message: 'The signature is intact, but it was not signed by {app}\'s developers. Do not install it.' }, { app: APP_NAME }),
          fingerprint: result.fingerprints.find(fp => !TRUSTED_SIGNERS.some(s => normalizeFingerprint(s.sha256) === fp)),
        };
      case 'invalid':
        // `reason` is a technical message from the verifier and stays in English.
        return { kind: 'invalid', fileName, reason: translate({ id: 'verify.reason.invalid', message: '{reason}. Do not install it.', description: '{reason} is a technical error in English, e.g. "Signature does not verify"' }, { reason: result.reason }) };
    }
  } catch (e) {
    if (e instanceof ApkFormatError)
      return { kind: 'invalid', fileName, reason: `${e.message}.` };
    console.error(e);
    return { kind: 'invalid', fileName, reason: translate({ id: 'verify.reason.unsupported', message: 'This file could not be checked. Your browser may not support it.' }) };
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
      title={translate({ id: 'verify.title', message: 'Verify APK' })}
      description={translate({ id: 'verify.description', message: 'Check that a {app} APK is genuine and unmodified. The file is checked in your browser and never uploaded.' }, { app: APP_NAME })}
    >
      <main className={clsx('container', styles.page)}>
        <h1><Translate id='verify.heading'>Verify your APK</Translate></h1>
        <p className={styles.lead}>
          <Translate id='verify.lead' values={{ app: APP_NAME }}>
            {'Check that a {app} APK was signed by its developers and hasn\'t been modified. Everything runs in your browser.'}
          </Translate>{' '}
          <strong><Translate id='verify.leadNoUpload'>Your file is never uploaded.</Translate></strong>
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
          aria-label={translate({ id: 'verify.zone.label', message: 'Choose or drop an APK file to verify' })}
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
                <div className={styles.zoneTitle}>{dragging
                  ? translate({ id: 'verify.zone.drop', message: 'Drop it here' })
                  : translate({ id: 'verify.zone.idle', message: 'Drag & drop an APK here' })}</div>
                <div className={styles.zoneHint}><Translate id='verify.zone.idleHint'>or click to choose a file</Translate></div>
              </>
            )}

            {state.kind === 'checking' && (
              <>
                <div className={styles.spinner} aria-hidden="true" />
                <div className={styles.zoneTitle}><Translate id='verify.zone.checking'>Checking signature…</Translate></div>
                <div className={styles.fileName}>{state.fileName}</div>
              </>
            )}

            {state.kind === 'valid' && (
              <>
                <Tick />
                <div className={styles.zoneTitle}>
                  <Translate id='verify.zone.valid' values={{ app: APP_NAME }}>{'Genuine {app} APK'}</Translate>
                  {state.info?.versionName && ` · ${state.info.versionName}`}
                </div>
                <div className={styles.fileName}>{state.fileName}</div>
                <div className={styles.zoneHint}>
                  <Translate id='verify.zone.validHint' values={{ signer: state.signer }}>{'Signed by {signer}. Safe to install.'}</Translate>
                </div>
              </>
            )}

            {state.kind === 'invalid' && (
              <>
                <Cross />
                <div className={styles.zoneTitle}>
                  <Translate id='verify.zone.invalid' values={{ app: APP_NAME }}>{'Not a genuine {app} APK'}</Translate>
                </div>
                <div className={styles.fileName}>{state.fileName}</div>
                <div className={styles.zoneHint}>{state.reason}</div>
              </>
            )}
          </div>
        </div>

        {(state.kind === 'valid' || state.kind === 'invalid') && (
          <div className={styles.actions}>
            <button className="button button--primary" onClick={reset}>
              <Translate id='verify.checkAnother'>Check another file</Translate>
            </button>
            {state.fingerprint && (
              <p className={styles.fingerprint}>
                <Translate id='verify.signerFingerprint'>Signer certificate SHA-256:</Translate><br />
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
          <summary><Translate id='verify.official.summary'>Official signing certificate</Translate></summary>
          <p>
            <Translate
              id='verify.official.body'
              values={{ command: <code>apksigner verify --print-certs Kreate.apk</code> }}
            >
              {'Official APKs from GitHub and IzzyOnDroid are signed with this certificate. You can also check an APK yourself with {command}.'}
            </Translate>
          </p>
          <ul>
            {TRUSTED_SIGNERS.map(s => (
              <li key={s.sha256}>
                <strong>{s.label()}</strong><br />
                <code className={styles.fpCode}>{formatFingerprint(s.sha256)}</code>
              </li>
            ))}
          </ul>
        </details>
      </main>
    </Layout>
  );
}
