import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';

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

// A function so translate() runs at render time, in the visitor's locale.
const getSources = (): Source[] => [
  {
    key: 'youtube-music',
    title: 'YouTube Music',
    to: '/usr/features/sources/youtube-music',
    icon: 'simple-icons:youtubemusic',
    points: [
      translate({ id: 'home.sources.youtube.point1', message: 'Search and stream its huge catalogue' }),
      translate({ id: 'home.sources.youtube.point2', message: 'Albums, artists and playlists' }),
    ],
  },
  {
    key: 'opensubsonic',
    title: translate({ id: 'home.sources.opensubsonic.title', message: 'OpenSubsonic server' }),
    to: '/usr/features/sources/opensubsonic',
    icon: 'mdi:server-network',
    points: [
      translate({ id: 'home.sources.opensubsonic.point1', message: 'Connect to your own music server' }),
      translate({ id: 'home.sources.opensubsonic.point2', message: 'Works with OpenSubsonic-compatible servers' }),
    ],
  },
  {
    key: 'local-files',
    title: translate({ id: 'home.sources.local.title', message: 'On-device media' }),
    to: '/usr/features/sources/local-files',
    icon: 'mdi:folder-music',
    points: [
      translate({ id: 'home.sources.local.point1', message: 'Play music files stored on your phone' }),
      translate({ id: 'home.sources.local.point2', message: 'No internet connection needed' }),
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
          {getSources().map( source => <SourceCard {...source} key={source.key} /> )}
        </div>

        <Highlights />

        <div className={styles.more}>
          <Link className={styles.moreLink} to='/usr/features'>
            <Translate id='home.features.more'>And many more features</Translate> <span aria-hidden='true'>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
