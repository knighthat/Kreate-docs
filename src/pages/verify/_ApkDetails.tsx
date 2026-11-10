import type { ReactNode } from 'react';

import type { ApkInfo } from '@utils/apk/inspect';
import { abiLabel, permissionLabel, sdkLabel } from '@utils/apk/labels';
import { APP_PACKAGE, APP_REPO_PATH, GITHUB_URL } from '@site/constants';
import styles from './styles.module.css';


function Row({ label, children }: { label: string; children: ReactNode }): ReactNode {
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

const unknown = <span className={styles.muted}>Not found</span>;


function AppSection({ info }: { info: ApkInfo }): ReactNode {
  return (
    <section className={styles.card}>
      <h2>App</h2>
      <dl>
        <Row label="Package name">{info.packageName ? <code>{info.packageName}</code> : unknown}</Row>
        <Row label="Version name">
          {info.versionName ?? unknown}
          {info.versionCode !== undefined && <span className={styles.muted}> (build {info.versionCode})</span>}
        </Row>
        <Row label="Minimum SDK">{info.minSdk !== undefined ? sdkLabel(info.minSdk) : unknown}</Row>
        <Row label="Target SDK">{info.targetSdk !== undefined ? sdkLabel(info.targetSdk) : unknown}</Row>
      </dl>
    </section>
  );
}


function BuildSection({ info }: { info: ApkInfo }): ReactNode {
  // Commits of other packages (e.g. Kreate 3) don't live in the GitHub repository.
  const commitUrl = info.gitCommit && info.packageName === APP_PACKAGE
    ? `${GITHUB_URL}/${APP_REPO_PATH}/commit/${info.gitCommit}`
    : undefined;

  const tools = [
    info.agpVersion && `Android Gradle Plugin ${info.agpVersion}`,
    info.gradleVersion && `Gradle ${info.gradleVersion}`,
    info.kotlinVersion && `Kotlin ${info.kotlinVersion}`,
  ].filter(Boolean) as string[];

  return (
    <section className={styles.card}>
      <h2>Build</h2>
      <dl>
        <Row label="CPU architecture">
          {info.abis.length === 0
            ? 'Any (no native code)'
            : info.abis.map(abi => (
              <div key={abi}>
                <code>{abi}</code>
                {abiLabel(abi) && <span className={styles.muted}> · {abiLabel(abi)}</span>}
              </div>
            ))}
        </Row>
        <Row label="Git commit">
          {info.gitCommit
            ? commitUrl
              ? <a href={commitUrl} target="_blank" rel="noopener noreferrer"><code>{info.gitCommit.slice(0, 12)}</code></a>
              : <code title={info.gitCommit}>{info.gitCommit.slice(0, 12)}</code>
            : unknown}
        </Row>
        <Row label="Build tools">
          {tools.length ? tools.map(t => <div key={t}>{t}</div>) : unknown}
        </Row>
      </dl>
    </section>
  );
}


function PermissionsSection({ info }: { info: ApkInfo }): ReactNode {
  const permissions = info.permissions;
  return (
    <section className={styles.card}>
      <h2>Permissions{permissions && <span className={styles.count}>{permissions.length}</span>}</h2>
      {!permissions
        ? <p className={styles.muted}>Could not be read.</p>
        : permissions.length === 0
          ? <p>This app requests no permissions.</p>
          : (
            <ul className={styles.permissions}>
              {permissions.map(p => {
                const label = permissionLabel(p.name);
                const short = p.name.replace(/^android\.permission\./, '');
                return (
                  <li key={p.name}>
                    {label && <div>{label}</div>}
                    <code className={styles.permName}>{short}</code>
                    {p.maxSdk !== undefined && (
                      <span className={styles.muted}> · only on {sdkLabel(p.maxSdk)} and older</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
    </section>
  );
}


function LibrariesSection({ info }: { info: ApkInfo }): ReactNode {
  return (
    <section className={styles.card}>
      <h2>Library versions{info.libraries.length > 0 && <span className={styles.count}>{info.libraries.length}</span>}</h2>
      {info.libraries.length === 0
        ? <p className={styles.muted}>This APK doesn't include library version information.</p>
        : (
          <details>
            <summary>Show all libraries</summary>
            <div className={styles.tableWrap}>
              <table className={styles.libraries}>
                <thead><tr><th>Library</th><th>Version</th></tr></thead>
                <tbody>
                  {info.libraries.map(l => (
                    <tr key={l.name}><td><code>{l.name}</code></td><td>{l.version}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
    </section>
  );
}


export default function ApkDetails({ info }: { info: ApkInfo }): ReactNode {
  return (
    <div className={styles.info}>
      <div className={styles.grid}>
        <AppSection info={info} />
        <BuildSection info={info} />
      </div>
      <PermissionsSection info={info} />
      <LibrariesSection info={info} />
    </div>
  );
}
