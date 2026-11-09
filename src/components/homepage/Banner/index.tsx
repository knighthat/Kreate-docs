import clsx from 'clsx';
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.css'
import { InlineBadges } from './DownloadBadges';


export default function Banner(): ReactNode {
  return(
    <header className={styles.hero}>
      <img src='/img/banner.webp' alt='' aria-hidden='true' className={styles.background} />
      <div className={styles.overlay} />

      <div className={clsx('container', styles.inner)}>
        <div className={styles.text}>
          <h1 className={styles.title}>
            Feature-rich &amp; customizable music player
          </h1>
          <Link className={styles.docsLink} to='/dev'>
            Read docs <span aria-hidden='true'>→</span>
          </Link>
          <InlineBadges className={styles.badges} />
        </div>

        <div className={styles.previews}>
          <img
            className={clsx(styles.phone, styles.back)}
            src='/img/17-artist-details-3.webp'
            alt='Artist details screen'
            width={1080}
            height={2400}
          />
          <img
            className={clsx(styles.phone, styles.front)}
            src='/img/01-player.webp'
            alt='Now playing screen'
            width={1080}
            height={2400}
          />
        </div>
      </div>

      <svg className={styles.wave} viewBox='0 0 1440 120' preserveAspectRatio='none' aria-hidden='true'>
        <path d='M0,64 C240,120 480,8 720,40 C960,72 1200,120 1440,56 L1440,120 L0,120 Z' />
      </svg>
    </header>
  )
}
