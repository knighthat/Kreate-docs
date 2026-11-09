import clsx from 'clsx';
import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.css'
import { InlineBadges } from './DownloadBadges';


/** 1x1 transparent GIF: what small screens "load" instead of the hidden screenshots. */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * The previews are hidden at <= 996px (see styles.module.css). CSS alone would still
 * download them, so <picture> swaps in BLANK there and the real file is never fetched.
 */
function Phone( { className, src, alt }: { className: string, src: string, alt: string } ): ReactNode {
  return(
    <picture className={clsx(styles.phone, className)}>
      <source media='(max-width: 996px)' srcSet={BLANK} />
      <img src={src} alt={alt} width={1080} height={2400} />
    </picture>
  )
}

export default function Banner(): ReactNode {
  return(
    <header className={styles.hero}>
      {/* Largest thing on the first screen, so fetch it before anything else. */}
      <img src='/img/banner.webp' alt='' aria-hidden='true' className={styles.background} fetchPriority='high' />
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
          <Phone
            className={styles.back}
            src='/img/screenshots/09-artist-details-3.webp'
            alt='Artist details screen'
          />
          <Phone
            className={styles.front}
            src='/img/screenshots/01-player.webp'
            alt='Now playing screen'
          />
        </div>
      </div>

      <svg className={styles.wave} viewBox='0 0 1440 120' preserveAspectRatio='none' aria-hidden='true'>
        <path d='M0,64 C240,120 480,8 720,40 C960,72 1200,120 1440,56 L1440,120 L0,120 Z' />
      </svg>
    </header>
  )
}
