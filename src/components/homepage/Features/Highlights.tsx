import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';

import styles from './highlights.module.css';


type Highlight = {
  /** Stable React key; titles are translated. */
  key: string
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
// A function so translate() runs at render time, in the visitor's locale.
const getHighlights = (): Highlight[] => [
  {
    key: 'lyrics',
    title: translate({ id: 'home.highlights.lyrics.title', message: 'Synced & plain lyrics' }),
    to: '/usr/features/playback/lyrics',
    icon: 'mdi:microphone-variant',
    description: translate({ id: 'home.highlights.lyrics.description', message: 'Lyrics from several providers, highlighted word by word when the source has it.' }),
    tags: [ 'BetterLyrics', 'LyricsPlus', 'LRCLIB', translate({ id: 'home.highlights.lyrics.tagMore', message: 'and more' }) ],
    wide: true,
  },
  {
    key: 'android-auto',
    title: 'Android Auto',
    to: '/usr/features/integrations/android-auto',
    icon: 'simple-icons:androidauto',
    description: translate({ id: 'home.highlights.androidAuto.description', message: 'Browse, play and search by voice from your car, with voice search settings.' }),
  },
  {
    key: 'loudness',
    title: translate({ id: 'home.highlights.loudness.title', message: 'Loudness normalization' }),
    to: '/usr/features/playback/loudness',
    icon: 'mdi:waveform',
    description: translate({ id: 'home.highlights.loudness.description', message: 'Brings each song as close as possible to your target level. Uses the server\'s ReplayGain when available, and a built-in loudness analyzer for local media.' }),
  },
  {
    key: 'opensubsonic',
    title: 'OpenSubsonic',
    to: '/usr/features/sources/opensubsonic',
    icon: 'mdi:server-network',
    description: translate({ id: 'home.highlights.opensubsonic.description', message: 'Connect to your OpenSubsonic-compatible server to stream music you own.' }),
    tags: [
      translate({ id: 'home.highlights.opensubsonic.tagAuth', message: 'Password or API key' }),
      translate({ id: 'home.highlights.opensubsonic.tagCerts', message: 'Self-signed certificates' }),
      translate({ id: 'home.highlights.opensubsonic.tagDirectPlay', message: 'Direct play' }),
      translate({ id: 'home.highlights.opensubsonic.tagReplayGain', message: 'Server ReplayGain' }),
    ],
    wide: true,
  },
  {
    key: 'youtube-music',
    title: 'YouTube Music',
    to: '/usr/features/sources/youtube-music',
    icon: 'simple-icons:youtubemusic',
    description: translate({ id: 'home.highlights.youtube.description', message: 'Supports sign-in, channel switching, library syncing and region settings.' }),
    wide: true,
  },
  {
    key: 'stream-quality',
    title: translate({ id: 'home.highlights.quality.title', message: 'Stream quality' }),
    to: '/usr/features/sources/overview#stream-quality',
    icon: 'mdi:wifi',
    description: translate({ id: 'home.highlights.quality.description', message: 'Set quality separately for Wi-Fi and mobile data, on each source.' }),
  },
  {
    key: 'sync',
    title: translate({ id: 'home.highlights.sync.title', message: 'Per-source sync' }),
    to: '/usr/features/sources/overview',
    icon: 'mdi:sync',
    description: translate({ id: 'home.highlights.sync.description', message: 'Separate sync switches for songs, playlists, albums and artists on every source.' }),
  },
  {
    key: 'musicbrainz',
    title: translate({ id: 'home.highlights.musicbrainz.title', message: 'MusicBrainz details' }),
    to: '/usr/features/library/details',
    icon: 'simple-icons:musicbrainz',
    description: translate({ id: 'home.highlights.musicbrainz.description', message: 'First release, ISRCs, genres, releases and links for songs, albums and artists.' }),
  },
  {
    key: 'sharing',
    title: translate({ id: 'home.highlights.sharing.title', message: 'Sharing' }),
    to: '/usr/features/integrations/open-with-and-links#sharing',
    icon: 'mdi:share-variant',
    description: translate({ id: 'home.highlights.sharing.description', message: 'Share YouTube links, OpenSubsonic share links, or the local file itself.' }),
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
      {getHighlights().map( highlight => <Tile {...highlight} key={highlight.key} /> )}
    </div>
  )
}
