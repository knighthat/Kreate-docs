import type { ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import { BuildBadges, type Build } from '@site/src/components/DownloadBadges';
import { APP_NAME } from '@site/constants';
import styles from './styles.module.css';


const CHOOSING_BUILD = '/docs/choosing-your-build';

type Section = {
  build: Build
  title: string
  description: string
}

const SECTIONS: Section[] = [
  {
    build: 'foss',
    title: 'FOSS build',
    description: 'Fully open source, with no telemetry and no closed-source libraries. Updates come through the store you install it from.',
  },
  {
    build: 'github',
    title: 'GitHub build',
    description: 'The newest version as soon as it is released, with a built-in updater and opt-in telemetry. Obtainium and OpenAPK install the same APK.',
  },
  {
    build: 'patreon',
    title: 'Patreon build',
    description: 'Advanced features for paid supporters. Some of its libraries are closed source, so it comes under a separate license.',
  },
];

const NEXT_STEPS: { to: string, label: string }[] = [
  { to: '/docs/faq/multiple-apks', label: 'Which APK do I need?' },
  { to: '/docs/installing-the-apk', label: 'Installing the APK' },
  { to: '/verify', label: 'Verify your download' },
];


export default function Download(): ReactNode {
  return (
    <Layout
      title='Download'
      description={`Every place you can download ${APP_NAME} from.`}
    >
      <main className={clsx('container', styles.page)}>
        <h1>Download {APP_NAME}</h1>
        <p className={styles.lead}>
          {APP_NAME} comes in three builds. Pick one below, or read <Link to={CHOOSING_BUILD}>Choosing your build</Link> for a full comparison.
        </p>

        {SECTIONS.map( ({ build, title, description }) => (
          <section key={build} className={styles.section}>
            <h2>{title}</h2>
            <p className={styles.description}>
              {description}{' '}
              <Link to={`${CHOOSING_BUILD}#${build}-build`}>
                Learn more
              </Link>
            </p>
            <BuildBadges build={build} className={styles.badges} />
          </section>
        ))}

        <div className={clsx('alert alert--warning', styles.switching)} role='note'>
          Switching to a different build may not install as an update. If Android refuses it, <Link to='/docs/features/backup/backup-and-restore'>back up your library</Link>, uninstall, then install the new build and restore.
        </div>

        <nav className={styles.nextSteps} aria-label='Next steps'>
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
