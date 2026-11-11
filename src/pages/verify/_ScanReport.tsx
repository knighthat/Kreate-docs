import { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';

import { checkScan, reportUrl, type ScanResult } from '@utils/apk/scan';
import styles from './styles.module.css';


type View = ScanResult | { status: 'loading' };

function ReportLink({ href }: { href: string }): ReactNode {
  return (
    <a className={styles.reportLink} href={href} target="_blank" rel="noopener noreferrer">
      <Translate id='verify.scan.fullReport'>View the full report on VirusTotal</Translate> ↗
    </a>
  );
}

function formatDate(iso: string): string | undefined {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? undefined : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}


function Body({ view, sha256, isIzzy, retry }: { view: View; sha256: string; isIzzy: boolean; retry: () => void }): ReactNode {
  const retryButton = <button className="button button--secondary button--sm" onClick={retry}>
    <Translate id='verify.scan.checkAgain'>Check again</Translate>
  </button>;

  switch (view.status) {
    case 'loading':
      return (
        <div className={styles.scanRow}>
          <div className={styles.miniSpinner} aria-hidden="true" />
          <span><Translate id='verify.scan.loading'>Looking up the scan report…</Translate></span>
        </div>
      );

    case 'clean': {
      const date = formatDate(view.checkedAt);
      return (
        <>
          <p className={clsx(styles.scanHeadline, styles.scanClean)}>
            <Translate id='verify.scan.clean'>No engines flagged this file</Translate>
          </p>
          <p className={styles.muted}>
            {date
              ? <Translate id='verify.scan.cleanDetailDated' values={{ engines: view.engines, date }}>{'Scanned by {engines} antivirus engines, last updated {date}.'}</Translate>
              : <Translate id='verify.scan.cleanDetail' values={{ engines: view.engines }}>{'Scanned by {engines} antivirus engines.'}</Translate>}
          </p>
          <ReportLink href={view.link} />
        </>
      );
    }

    case 'flagged': {
      const date = formatDate(view.checkedAt);
      const parts =
        view.malicious > 0 && view.suspicious > 0
          ? translate({ id: 'verify.scan.flaggedBoth', message: 'Flagged {malicious} as malicious and {suspicious} as suspicious.' }, { malicious: view.malicious, suspicious: view.suspicious })
          : view.malicious > 0
            ? translate({ id: 'verify.scan.flaggedMalicious', message: 'Flagged {count} as malicious.' }, { count: view.malicious })
            : view.suspicious > 0
              ? translate({ id: 'verify.scan.flaggedSuspicious', message: 'Flagged {count} as suspicious.' }, { count: view.suspicious })
              : '';
      return (
        <>
          <p className={clsx(styles.scanHeadline, styles.scanFlagged)}>
            <Translate id='verify.scan.flagged' values={{ flagged: view.malicious + view.suspicious, engines: view.engines }}>
              {'{flagged} of {engines} engines flagged this file'}
            </Translate>
          </p>
          <p className={styles.muted}>
            {parts && `${parts} `}
            <Translate id='verify.scan.falsePositives'>Android apps often get one or two false positives, so check the report and judge for yourself.</Translate>
            {date && <>{' '}<Translate id='verify.scan.lastUpdated' values={{ date }}>{'Last updated {date}.'}</Translate></>}
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
            <span className={styles.scanHeadline}><Translate id='verify.scan.inProgress'>Scan in progress</Translate></span>
          </div>
          <p className={styles.muted}>
            <Translate id='verify.scan.notFinished'>VirusTotal hasn't finished scanning this file yet.</Translate>{' '}
            {view.retryIn !== null
              ? translate({ id: 'verify.scan.retryIn', message: 'Checking again in about {seconds} seconds.' }, { seconds: view.retryIn })
              : translate({ id: 'verify.scan.checkLater', message: 'New releases usually finish within a few minutes, so check again later.' })}
          </p>
          {view.retryIn === null && retryButton}
          <ReportLink href={reportUrl(sha256)} />
        </>
      );

    case 'error':
      return (
        <>
          <p className={styles.scanHeadline}><Translate id='verify.scan.error'>This file couldn't be scanned</Translate></p>
          <p className={styles.muted}>
            <Translate id='verify.scan.errorDetail'>Uploading this release to VirusTotal failed, so there is no report for it.</Translate>
          </p>
        </>
      );

    case 'unknown':
      if (isIzzy) return (
        <>
          <p className={styles.scanHeadline}><Translate id='verify.scan.izzy'>Scanned by IzzyOnDroid</Translate></p>
          <p className={styles.muted}>
            <Translate id='verify.scan.izzyDetail'>
              {'This is the IzzyOnDroid (FOSS) build. Kreate doesn\'t upload it to VirusTotal itself: IzzyOnDroid scans every APK it publishes, so VirusTotal should already have a report for this exact file. A very new release may take up to a day to appear.'}
            </Translate>
          </p>
          <ReportLink href={reportUrl(sha256)} />
        </>
      );
      return (
        <>
          <p className={styles.scanHeadline}><Translate id='verify.scan.unknown'>This build isn't in Kreate's scan records</Translate></p>
          <p className={styles.muted}>
            <Translate id='verify.scan.unknownDetail'>
              {'That doesn\'t mean anything is wrong: the signature check above already confirms the file is genuine. Releases published before scanning was switched on, very new GitLab releases (they take about 15 minutes to be recorded) and FOSS builds have no scan record.'}
            </Translate>
          </p>
          <ReportLink href={reportUrl(sha256)} />
        </>
      );

    case 'unavailable':
      return (
        <>
          <p className={styles.scanHeadline}><Translate id='verify.scan.unavailable'>Scan records are unavailable right now</Translate></p>
          <p className={styles.muted}>
            <Translate id='verify.scan.unavailableDetail'>Kreate's scan service couldn't be reached. Try again in a few minutes.</Translate>
          </p>
          {retryButton}
        </>
      );

    case 'failed':
      return (
        <>
          <p className={styles.scanHeadline}><Translate id='verify.scan.failed'>The scan report couldn't be loaded</Translate></p>
          <p className={styles.muted}>
            <Translate id='verify.scan.failedDetail'>Something went wrong on our side. Please report this on GitHub.</Translate>
          </p>
        </>
      );
  }
}


/**
 * VirusTotal report for a verified APK. Only the file's SHA-256 is sent to Kreate's API.
 *
 * @param isIzzy The IzzyOnDroid (FOSS) build, which Kreate doesn't upload: IzzyOnDroid scans it instead.
 */
export default function ScanReport({ sha256, isIzzy = false }: { sha256: string; isIzzy?: boolean }): ReactNode {
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
      <h2><Translate id='verify.scan.heading'>VirusTotal scan</Translate></h2>
      <Body view={view} sha256={sha256} isIzzy={isIzzy} retry={() => setRun(n => n + 1)} />
      <p className={styles.sha}>
        SHA-256 <code>{sha256}</code>
      </p>
    </section>
  );
}
