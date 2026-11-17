import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';
import Highlights from './Highlights';


type Source = {
  /** Stable React key; titles are translated. */
  key: string
  title: string
  icon: string
  points: string[]
  /** Doc the card links to. */
  to: string
};

const SOURCES: Source[] = [
  {
    key: 'youtube-music',
    title: 'YouTube Music',
    to: '/docs/features/sources/youtube-music',
    icon: 'simple-icons:youtubemusic',
    points: [
      'Search and stream its huge catalogue',
      'Albums, artists and playlists',
    ],
  },
  {
    key: 'opensubsonic',
    title: 'OpenSubsonic server',
    to: '/docs/features/sources/opensubsonic',
    icon: 'mdi:server-network',
    points: [
      'Connect to your own music server',
      'Works with OpenSubsonic-compatible servers',
    ],
  },
  {
    key: 'local-files',
    title: 'On-device media',
    to: '/docs/features/sources/local-files',
    icon: 'mdi:folder-music',
    points: [
      'Play music files stored on your phone',
      'No internet connection needed',
    ],
  },
];

function SourceCard( { title, icon, points, to }: Source ): ReactNode {
  return(
    <Link to={to} className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.iconBadge}>
          <Icon icon={icon} />
        </span>
      </div>

      <h3 className={styles.cardTitle}>{title}</h3>

      <ul className={styles.points}>
        {points.map( point => (
          <li key={point}>
            <Icon icon='mdi:check-circle' className={styles.check} aria-hidden='true' />
            {point}
          </li>
        ))}
      </ul>
    </Link>
  )
}

export default function Features(): ReactNode {
  return(
    <section className={clsx(styles.section, 'padding-vert--xl')}>
      <div className='container'>
        <div className={styles.sources}>
          {SOURCES.map( source => <SourceCard {...source} key={source.key} /> )}
        </div>

        <Highlights />

        <div className={styles.more}>
          <Link className={styles.moreLink} to='/docs/features'>
            And many more features <span aria-hidden='true'>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
