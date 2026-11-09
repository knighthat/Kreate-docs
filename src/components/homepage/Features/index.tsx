import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';
import Highlights from './Highlights';


type Source = {
  title: string
  icon: string
  points: string[]
};

const sources: Source[] = [
  {
    title: 'YouTube Music',
    icon: 'simple-icons:youtubemusic',
    points: [
      'Search and stream its huge catalogue',
      'Albums, artists and playlists',
    ],
  },
  {
    title: 'OpenSubsonic server',
    icon: 'mdi:server-network',
    points: [
      'Connect to your own music server',
      'Works with OpenSubsonic-compatible servers',
    ],
  },
  {
    title: 'On-device media',
    icon: 'mdi:folder-music',
    points: [
      'Play music files stored on your phone',
      'No internet connection needed',
    ],
  },
];

function SourceCard( { title, icon, points }: Source ): ReactNode {
  return(
    <article className={styles.card}>
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
    </article>
  )
}

export default function Features(): ReactNode {
  return(
    <section className={clsx(styles.section, 'padding-vert--xl')}>
      <div className='container'>
        <div className={styles.sources}>
          {sources.map( source => <SourceCard key={source.title} {...source} /> )}
        </div>

        <Highlights />

        <div className={styles.more}>
          <Link className={styles.moreLink} to='/usr'>
            And many more features <span aria-hidden='true'>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
