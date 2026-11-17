import { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';

import { checkScan, reportUrl, type ScanResult } from '@utils/apk/scan';
import { APP_NAME, APP_REPO_PATH, GITHUB_URL } from '@site/constants';
import styles from './styles.module.css';


type View = ScanResult | { status: 'loading' };

function ReportLink({ href }: { href: string }): ReactNode {
  return (
    <a className={styles.reportLink} href={href} target="_blank" rel="noopener noreferrer">
      View the full report on VirusTotal ↗
    </a>
  );
}

function formatDate(iso: string, locale: string): string | undefined {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}


function Body({ view, sha256, isFoss, retry }: { view: View; sha256: string; isFoss: boolean; retry: () => void }): ReactNode {
  const retryButton = <button className="button button--secondary button--sm" onClick={retry}>
    Check again
  </button>;

  switch (view.status) {
    case 'loading':
      return (
        <div className={styles.scanRow}>
          <div className={styles.miniSpinner} aria-hidden="true" />
          <span>Looking up the scan report…</span>
        </div>
      );

    case 'clean': {
      const date = formatDate(view.checkedAt, 'en');
      return (
        <>
          <p className={clsx(styles.scanHeadline, styles.scanClean)}>
            No engines flagged this file
          </p>
          <p className={styles.muted}>
            {date
              ? <>Scanned by {view.engines} antivirus engines, last updated {date}.</>
              : <>Scanned by {view.engines} antivirus engines.</>}
          </p>
          <ReportLink href={view.link} />
        </>
      );
    }

    case 'flagged': {
      const date = formatDate(view.checkedAt, 'en');
      const parts =
        view.malicious > 0 && view.suspicious > 0
          ? `Flagged ${view.malicious} as malicious and ${view.suspicious} as suspicious.`
          : view.malicious > 0
            ? `Flagged ${view.malicious} as malicious.`
            : view.suspicious > 0
              ? `Flagged ${view.suspicious} as suspicious.`
              : '';
      return (
        <>
          <p className={clsx(styles.scanHeadline, styles.scanFlagged)}>
            {view.malicious + view.suspicious} of {view.engines} engines flagged this file
          </p>
          <p className={styles.muted}>
            {parts && `${parts} `}
            Android apps often get one or two false positives, so check the report and judge for yourself.
            {date && <>{' '}Last updated {date}.</>}
          </p>
          <ReportLink href={view.link} />
        </>
      );
    }

    case 'scanning':
      return (
        <>
          <div className={styles.scanRow}>
            {view.retryIn !== null && <div className={styles.miniSpinner} aria-hidden="true" />}
            <span className={styles.scanHeadline}>Scan in progress</span>
          </div>
          <p className={styles.muted}>
            VirusTotal hasn't finished scanning this file yet.{' '}
            {view.retryIn !== null
              ? `Checking again in about ${view.retryIn} seconds.`
              : 'New releases usually finish within a few minutes, so check again later.'}
          </p>
          {view.retryIn === null && retryButton}
          <ReportLink href={reportUrl(sha256)} />
        </>
      );

    case 'error':
      return (
        <>
          <p className={styles.scanHeadline}>This file couldn't be scanned</p>
          <p className={styles.muted}>
            Uploading this release to VirusTotal failed, so there is no report for it.
          </p>
        </>
      );

    case 'unknown':
      if (isFoss) return (
        <>
          <p className={styles.scanHeadline}>FOSS build, scanned by IzzyOnDroid</p>
          <p className={styles.muted}>
            This is the FOSS build. {APP_NAME} doesn't upload it to VirusTotal itself, but IzzyOnDroid scans every APK it publishes, and F-Droid and GitHub ship the same file. VirusTotal should already have a report for it, though a very new release may take up to a day to appear.
          </p>
          <ReportLink href={reportUrl(sha256)} />
        </>
      );
      return (
        <>
          <p className={styles.scanHeadline}>This build isn't in {APP_NAME}'s scan records</p>
          <p className={styles.muted}>
            {'That doesn\'t mean anything is wrong: the signature check above already confirms the file is genuine. Releases published before scanning was switched on have no scan record, and very new releases take about 15 minutes to be recorded.'}
          </p>
          <ReportLink href={reportUrl(sha256)} />
        </>
      );

    case 'unavailable':
      return (
        <>
          <p className={styles.scanHeadline}>Scan records are unavailable right now</p>
          <p className={styles.muted}>
            {APP_NAME}'s scan service couldn't be reached. Try again in a few minutes.
          </p>
          {retryButton}
        </>
      );

    case 'failed':
      return (
        <>
          <p className={styles.scanHeadline}>The scan report couldn't be loaded</p>
          <p className={styles.muted}>
            Something went wrong on our side. Please <a href={`${GITHUB_URL}/${APP_REPO_PATH}/issues`} target="_blank" rel="noopener noreferrer">report this on GitHub</a>.
          </p>
        </>
      );
  }
}


/**
 * VirusTotal report for a verified APK. Only the file's SHA-256 is sent to Kreate's API.
 *
 * @param isFoss The FOSS build, which Kreate doesn't upload: IzzyOnDroid scans it instead.
 */
export default function ScanReport({ sha256, isFoss = false }: { sha256: string; isFoss?: boolean }): ReactNode {
  const [view, setView] = useState<View>({ status: 'loading' });
  const [run, setRun] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'loading' });
    checkScan(sha256, setView, controller.signal)
      .then(setView)
      .catch(e => { if (!controller.signal.aborted) { console.error(e); setView({ status: 'unavailable' }); } });
    return () => controller.abort();
  }, [sha256, run]);

  return (
    <section className={clsx(styles.card, styles.scanCard)} aria-live="polite">
      <h2>VirusTotal scan</h2>
      <Body view={view} sha256={sha256} isFoss={isFoss} retry={() => setRun(n => n + 1)} />
      <p className={styles.sha}>
        SHA-256 <code>{sha256}</code>
      </p>
    </section>
  );
}
