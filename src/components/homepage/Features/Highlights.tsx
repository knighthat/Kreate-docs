import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import Link from '@docusaurus/Link';

import styles from './highlights.module.css';


type Highlight = {
  /** Stable React key; titles are translated. */
  key: string
  title: string
  icon: string
  description: string
  tags?: string[]
  /** Doc the tile links to; without one the tile is a plain card. */
  to?: string
  /** Spans two columns on wider screens. */
  wide?: boolean
};

// Order is chosen so wide (2) and narrow (1) tiles fill 3-column rows exactly.
const HIGHLIGHTS: Highlight[] = [
  {
    key: 'lyrics',
    title: 'Synced & plain lyrics',
    to: '/docs/features/playback/lyrics',
    icon: 'mdi:microphone-variant',
    description: 'Lyrics from several providers, highlighted word by word when the source has it.',
    tags: [ 'BetterLyrics', 'LyricsPlus', 'LRCLIB', 'and more' ],
    wide: true,
  },
  {
    key: 'android-auto',
    title: 'Android Auto',
    to: '/docs/features/integrations/android-auto',
    icon: 'simple-icons:androidauto',
    description: 'Browse, play and search by voice from your car, with voice search settings.',
  },
  {
    key: 'loudness',
    title: 'Loudness normalization',
    to: '/docs/features/playback/loudness',
    icon: 'mdi:waveform',
    description: 'Brings each song as close as possible to your target level, with a built-in loudness analyzer for local media.',
  },
  {
    key: 'discord-rpc',
    title: 'Discord RPC',
    icon: 'bi:discord',
    description: 'Shows what you\'re doing in Kreate on your Discord profile.',
    tags: [
      'Streaming music',
      'Browsing albums, artists & playlists',
      'Searching',
    ],
    wide: true,
  },
  {
    key: 'profiles',
    title: 'Profiles',
    to: '/docs/features/account/profiles',
    icon: 'mdi:account-switch',
    description: 'Several people, or several moods, can share one install, each with their own profile.',
    tags: [
      'Own library',
      'Own settings',
      'Own sign-ins',
    ],
    wide: true,
  },
  {
    key: 'stream-quality',
    title: 'Stream quality',
    to: '/docs/features/sources/overview#stream-quality',
    icon: 'mdi:wifi',
    description: 'Set quality separately for Wi-Fi and mobile data, on each source.',
  },
  {
    key: 'statistics',
    title: 'Statistics',
    to: '/docs/features/account/statistics',
    icon: 'mdi:chart-bar',
    description: 'Time listened, top songs, albums and artists, and charts for any of them.',
  },
  {
    key: 'musicbrainz',
    title: 'MusicBrainz details',
    to: '/docs/features/library/details',
    icon: 'simple-icons:musicbrainz',
    description: 'First release, ISRCs, genres, releases and links for songs, albums and artists.',
  },
  {
    key: 'sharing',
    title: 'Sharing',
    to: '/docs/features/integrations/open-with-and-links#sharing',
    icon: 'mdi:share-variant',
    description: 'Share YouTube links, OpenSubsonic share links, or the local file itself.',
  },
];

function Tile( { title, icon, description, tags, wide, to }: Highlight ): ReactNode {
  const className = clsx(styles.tile, wide && styles.wide, !to && styles.static);
  const content = (
    <>
      <span className={styles.icon}>
        <Icon icon={icon} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {tags && (
        <ul className={styles.tags}>
          {tags.map( tag => <li key={tag}>{tag}</li> )}
        </ul>
      )}
    </>
  );

  return to
    ? <Link to={to} className={className}>{content}</Link>
    : <div className={className}>{content}</div>
}

export default function Highlights(): ReactNode {
  return(
    <div className={styles.grid}>
      {HIGHLIGHTS.map( highlight => <Tile {...highlight} key={highlight.key} /> )}
    </div>
  )
}
