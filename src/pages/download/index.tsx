import type { ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';

import { BuildBadges, type Build } from '@site/src/components/DownloadBadges';
import { APP_NAME } from '@site/constants';
import styles from './styles.module.css';


const CHOOSING_BUILD = '/usr/choosing-your-build';

type Section = {
  build: Build
  title: ReactNode
  description: ReactNode
}

const SECTIONS: Section[] = [
  {
    build: 'foss',
    title: <Translate id='download.foss.title'>FOSS build</Translate>,
    description: (
      <Translate id='download.foss.description'>
        Fully open source, with no telemetry and no closed-source libraries. Updates come through the store you install it from.
      </Translate>
    ),
  },
  {
    build: 'github',
    title: <Translate id='download.github.title'>GitHub build</Translate>,
    description: (
      <Translate id='download.github.description'>
        The newest version as soon as it is released, with a built-in updater and opt-in telemetry. Obtainium and OpenAPK install the same APK.
      </Translate>
    ),
  },
  {
    build: 'patreon',
    title: <Translate id='download.patreon.title'>Patreon build</Translate>,
    description: (
      <Translate id='download.patreon.description'>
        Advanced features for paid supporters. Some of its libraries are closed source, so it comes under a separate license.
      </Translate>
    ),
  },
];

const NEXT_STEPS: { to: string, label: ReactNode }[] = [
  { to: '/usr/faq/multiple-apks', label: <Translate id='download.next.whichApk'>Which APK do I need?</Translate> },
  { to: '/usr/installing-the-apk', label: <Translate id='download.next.install'>Installing the APK</Translate> },
  { to: '/verify', label: <Translate id='download.next.verify'>Verify your download</Translate> },
];


export default function Download(): ReactNode {
  return (
    <Layout
      title={translate({ id: 'download.title', message: 'Download' })}
      description={translate({ id: 'download.description', message: 'Every place you can download {app} from.' }, { app: APP_NAME })}
    >
      <main className={clsx('container', styles.page)}>
        <h1><Translate id='download.heading' values={{ app: APP_NAME }}>{'Download {app}'}</Translate></h1>
        <p className={styles.lead}>
          <Translate
            id='download.leadBuilds'
            values={{
              app: APP_NAME,
              link: <Link to={CHOOSING_BUILD}><Translate id='download.leadLink'>Choosing your build</Translate></Link>,
            }}
          >
            {'{app} comes in three builds. Pick one below, or read {link} for a full comparison.'}
          </Translate>
        </p>

        {SECTIONS.map( ({ build, title, description }) => (
          <section key={build} className={styles.section}>
            <h2>{title}</h2>
            <p className={styles.description}>
              {description}{' '}
              <Link to={`${CHOOSING_BUILD}#${build}-build`}>
                <Translate id='download.learnMore'>Learn more</Translate>
              </Link>
            </p>
            <BuildBadges build={build} className={styles.badges} />
          </section>
        ))}

        <div className={clsx('alert alert--warning', styles.switching)} role='note'>
          <Translate
            id='download.switching'
            values={{ link: <Link to='/usr/features/backup/backup-and-restore'><Translate id='download.switchingLink'>back up your library</Translate></Link> }}
          >
            {'Switching to a different build may not install as an update. If Android refuses it, {link}, uninstall, then install the new build and restore.'}
          </Translate>
        </div>

        <nav className={styles.nextSteps} aria-label={translate({ id: 'download.next.label', message: 'Next steps' })}>
          {NEXT_STEPS.map( ({ to, label }) => (
            <Link key={to} to={to} className={clsx('button button--secondary button--outline', styles.nextStep)}>
              {label}
            </Link>
          ))}
        </nav>
      </main>
    </Layout>
  );
}
