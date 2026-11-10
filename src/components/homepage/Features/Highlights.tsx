import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import Link from '@docusaurus/Link';

import styles from './highlights.module.css';


type Highlight = {
  title: string
  icon: string
  description: string
  tags?: string[]
  /** Doc the tile links to. */
  to: string
  /** Spans two columns on wider screens. */
  wide?: boolean
};

// Order is chosen so wide (2) and narrow (1) tiles fill 3-column rows exactly.
const highlights: Highlight[] = [
  {
    title: 'Synced & plain lyrics',
    to: '/usr/features/playback/lyrics',
    icon: 'mdi:microphone-variant',
    description: 'Lyrics from several providers, highlighted word by word when the source has it.',
    tags: [ 'BetterLyrics', 'LyricsPlus', 'LRCLIB', 'and more' ],
    wide: true,
  },
  {
    title: 'Android Auto',
    to: '/usr/features/integrations/android-auto',
    icon: 'simple-icons:androidauto',
    description: 'Browse, play and search by voice from your car, with voice search settings.',
  },
  {
    title: 'Loudness normalization',
    to: '/usr/features/playback/loudness',
    icon: 'mdi:waveform',
    description: 'Brings each song as close as possible to your target level. Uses the server\'s ReplayGain when available, and a built-in loudness analyzer for local media.',
  },
  {
    title: 'OpenSubsonic',
    to: '/usr/features/sources/opensubsonic',
    icon: 'mdi:server-network',
    description: 'Connect to your OpenSubsonic-compatible server to stream music you own.',
    tags: [ 'Password or API key', 'Self-signed certificates', 'Direct play', 'Server ReplayGain' ],
    wide: true,
  },
  {
    title: 'YouTube Music',
    to: '/usr/features/sources/youtube-music',
    icon: 'simple-icons:youtubemusic',
    description: 'Supports sign-in, channel switching, library syncing and region settings.',
    wide: true,
  },
  {
    title: 'Stream quality',
    to: '/usr/features/sources/overview#stream-quality',
    icon: 'mdi:wifi',
    description: 'Set quality separately for Wi-Fi and mobile data, on each source.',
  },
  {
    title: 'Per-source sync',
    to: '/usr/features/sources/overview',
    icon: 'mdi:sync',
    description: 'Separate sync switches for songs, playlists, albums and artists on every source.',
  },
  {
    title: 'MusicBrainz details',
    to: '/usr/features/library/details',
    icon: 'simple-icons:musicbrainz',
    description: 'First release, ISRCs, genres, releases and links for songs, albums and artists.',
  },
  {
    title: 'Sharing',
    to: '/usr/features/integrations/open-with-and-links#sharing',
    icon: 'mdi:share-variant',
    description: 'Share YouTube links, OpenSubsonic share links, or the local file itself.',
  },
];

function Tile( { title, icon, description, tags, wide, to }: Highlight ): ReactNode {
  return(
    <Link to={to} className={clsx(styles.tile, wide && styles.wide)}>
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
    </Link>
  )
}

export default function Highlights(): ReactNode {
  return(
    <div className={styles.grid}>
      {highlights.map( highlight => <Tile key={highlight.title} {...highlight} /> )}
    </div>
  )
}
