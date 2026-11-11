import type { ReactNode } from 'react';

import Translate, { translate } from '@docusaurus/Translate';

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

const unknown = <span className={styles.muted}><Translate id='verify.details.notFound'>Not found</Translate></span>;


function AppSection({ info }: { info: ApkInfo }): ReactNode {
  return (
    <section className={styles.card}>
      <h2><Translate id='verify.details.app' description='Heading of the APK details card about the app'>App</Translate></h2>
      <dl>
        <Row label={translate({ id: 'verify.details.packageName', message: 'Package name' })}>{info.packageName ? <code>{info.packageName}</code> : unknown}</Row>
        <Row label={translate({ id: 'verify.details.versionName', message: 'Version name' })}>
          {info.versionName ?? unknown}
          {info.versionCode !== undefined && <span className={styles.muted}>
            {' '}<Translate id='verify.details.versionCode' values={{ code: info.versionCode }}>{'(build {code})'}</Translate>
          </span>}
        </Row>
        <Row label={translate({ id: 'verify.details.minSdk', message: 'Minimum SDK' })}>{info.minSdk !== undefined ? sdkLabel(info.minSdk) : unknown}</Row>
        <Row label={translate({ id: 'verify.details.targetSdk', message: 'Target SDK' })}>{info.targetSdk !== undefined ? sdkLabel(info.targetSdk) : unknown}</Row>
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
      <h2><Translate id='verify.details.build' description='Heading of the APK details card about how it was built'>Build</Translate></h2>
      <dl>
        <Row label={translate({ id: 'verify.details.cpu', message: 'CPU architecture' })}>
          {info.abis.length === 0
            ? translate({ id: 'verify.details.anyAbi', message: 'Any (no native code)' })
            : info.abis.map(abi => (
              <div key={abi}>
                <code>{abi}</code>
                {abiLabel(abi) && <span className={styles.muted}> · {abiLabel(abi)}</span>}
              </div>
            ))}
        </Row>
        <Row label={translate({ id: 'verify.details.gitCommit', message: 'Git commit' })}>
          {info.gitCommit
            ? commitUrl
              ? <a href={commitUrl} target="_blank" rel="noopener noreferrer"><code>{info.gitCommit.slice(0, 12)}</code></a>
              : <code title={info.gitCommit}>{info.gitCommit.slice(0, 12)}</code>
            : unknown}
        </Row>
        <Row label={translate({ id: 'verify.details.buildTools', message: 'Build tools' })}>
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
      <h2><Translate id='verify.details.permissions'>Permissions</Translate>{permissions && <span className={styles.count}>{permissions.length}</span>}</h2>
      {!permissions
        ? <p className={styles.muted}><Translate id='verify.details.permissionsUnreadable'>Could not be read.</Translate></p>
        : permissions.length === 0
          ? <p><Translate id='verify.details.noPermissions'>This app requests no permissions.</Translate></p>
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
                      <span className={styles.muted}>
                        {' · '}
                        <Translate id='verify.details.maxSdk' values={{ sdk: sdkLabel(p.maxSdk) }}>{'only on {sdk} and older'}</Translate>
                      </span>
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
      <h2><Translate id='verify.details.libraries'>Library versions</Translate>{info.libraries.length > 0 && <span className={styles.count}>{info.libraries.length}</span>}</h2>
      {info.libraries.length === 0
        ? <p className={styles.muted}>
            <Translate id='verify.details.noLibraries'>This APK doesn't include library version information.</Translate>
          </p>
        : (
          <details>
            <summary><Translate id='verify.details.showLibraries'>Show all libraries</Translate></summary>
            <div className={styles.tableWrap}>
              <table className={styles.libraries}>
                <thead>
                  <tr>
                    <th><Translate id='verify.details.library'>Library</Translate></th>
                    <th><Translate id='verify.details.version'>Version</Translate></th>
                  </tr>
                </thead>
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
