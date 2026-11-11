import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import { translate } from '@docusaurus/Translate';

import styles from './styles.module.css';


type Screenshot = {
  file: string
  caption: string
};

// A function so translate() runs at render time, in the visitor's locale.
const getScreenshots = (): Screenshot[] => [
  { file: '01-player', caption: translate({ id: 'home.screenshots.player', message: 'Player' }) },
  { file: '02-queue', caption: translate({ id: 'home.screenshots.queue', message: 'Queue' }) },
  { file: '03-lyrics', caption: translate({ id: 'home.screenshots.lyrics', message: 'Lyrics' }) },
  { file: '04-songs', caption: translate({ id: 'home.screenshots.songs', message: 'Songs' }) },
  { file: '05-albums', caption: translate({ id: 'home.screenshots.albums', message: 'Albums' }) },
  { file: '06-artists', caption: translate({ id: 'home.screenshots.artists', message: 'Artists' }) },
  { file: '07-playlists', caption: translate({ id: 'home.screenshots.playlists', message: 'Playlists' }) },
  { file: '08-album-details', caption: translate({ id: 'home.screenshots.albumDetails', message: 'Album details' }) },
  { file: '08-album-details-2', caption: translate({ id: 'home.screenshots.albumDetails', message: 'Album details' }) },
  { file: '08-album-details-3', caption: translate({ id: 'home.screenshots.albumDetails', message: 'Album details' }) },
  { file: '09-artist-details', caption: translate({ id: 'home.screenshots.artistDetails', message: 'Artist details' }) },
  { file: '09-artist-details-2', caption: translate({ id: 'home.screenshots.artistDetails', message: 'Artist details' }) },
  { file: '09-artist-details-3', caption: translate({ id: 'home.screenshots.artistDetails', message: 'Artist details' }) },
  { file: '10-playlist-details', caption: translate({ id: 'home.screenshots.playlistDetails', message: 'Playlist details' }) },
  { file: '10-playlist-details-2', caption: translate({ id: 'home.screenshots.playlistDetails', message: 'Playlist details' }) },
  { file: '10-playlist-details-3', caption: translate({ id: 'home.screenshots.playlistDetails', message: 'Playlist details' }) },
  { file: '11-history', caption: translate({ id: 'home.screenshots.history', message: 'History' }) },
  { file: '12-statistics', caption: translate({ id: 'home.screenshots.statistics', message: 'Statistics' }) },
  { file: '13-search-suggestions', caption: translate({ id: 'home.screenshots.searchSuggestions', message: 'Search suggestions' }) },
  { file: '14-album-menu', caption: translate({ id: 'home.screenshots.albumMenu', message: 'Album menu' }) },
  { file: '15-artist-menu', caption: translate({ id: 'home.screenshots.artistMenu', message: 'Artist menu' }) },
  { file: '16-playlist-menu', caption: translate({ id: 'home.screenshots.playlistMenu', message: 'Playlist menu' }) },
];

/** Phones rendered on each side of the active one; the outermost is faded out. */
const VISIBLE_SIDE = 3;
const AUTOPLAY_MS = 3500;
const SWIPE_PX = 40;

/** Shortest signed distance from `active` to `index` on a ring of `length` items. */
function ringOffset( index: number, active: number, length: number ): number {
  let offset = ( index - active ) % length;
  if( offset > length / 2 ) offset -= length;
  if( offset < -length / 2 ) offset += length;
  return offset;
}

export default function Screenshots(): ReactNode {
  const screenshots = getScreenshots();
  const count = screenshots.length;
  const [active, setActive] = useState( 0 );
  const [paused, setPaused] = useState( false );
  const pointerStart = useRef<number | null>( null );
  // Set after a swipe so the click that follows it doesn't also navigate.
  const swiped = useRef( false );

  const go = useCallback(
    ( step: number ) => setActive( current => ( current + step + count ) % count ),
    [count]
  );

  // Autoplay, unless paused by hover/focus or the visitor prefers reduced motion.
  useEffect(() => {
    if( paused || window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches )
      return;

    const timer = window.setInterval( () => {
      if( !document.hidden ) go( 1 );
    }, AUTOPLAY_MS );
    return () => window.clearInterval( timer );
  }, [paused, go]);

  return(
    <section
      className={styles.section}
      aria-roledescription='carousel'
      aria-label={translate({ id: 'home.screenshots.label', message: 'App screenshots' })}
      onMouseEnter={() => setPaused( true )}
      onMouseLeave={() => setPaused( false )}
      onFocus={() => setPaused( true )}
      onBlur={() => setPaused( false )}
    >
      <div className={styles.viewport}>
        <button type='button' className={clsx(styles.arrow, styles.prev)} onClick={() => go( -1 )} aria-label={translate({ id: 'home.screenshots.previous', message: 'Previous screenshot' })}>
          <Icon icon='mdi:chevron-left' />
        </button>

        <div
          className={styles.stage}
          tabIndex={0}
          onKeyDown={event => {
            if( event.key === 'ArrowLeft' ) go( -1 );
            if( event.key === 'ArrowRight' ) go( 1 );
          }}
          onPointerDown={event => {
            pointerStart.current = event.clientX;
            swiped.current = false;
          }}
          onPointerUp={event => {
            if( pointerStart.current === null ) return;
            const dx = event.clientX - pointerStart.current;
            pointerStart.current = null;
            if( Math.abs( dx ) > SWIPE_PX ) {
              swiped.current = true;
              go( dx < 0 ? 1 : -1 );
            }
          }}
        >
          {screenshots.map( ( { file, caption }, index ) => {
            const offset = ringOffset( index, active, count );
            if( Math.abs( offset ) > VISIBLE_SIDE )
              return null;

            const style = {
              '--offset': offset,
              '--distance': Math.abs( offset ),
              zIndex: 10 - Math.abs( offset ),
            } as CSSProperties;

            return(
              <img
                key={file}
                className={styles.phone}
                style={style}
                src={`/img/screenshots/${file}.webp`}
                alt={offset === 0 ? translate({ id: 'home.screenshots.alt', message: '{screen} screen', description: 'Alt text of the centered screenshot; {screen} is its caption' }, { screen: caption }) : ''}
                aria-hidden={offset !== 0}
                width={1080}
                height={2400}
                draggable={false}
                onClick={() => !swiped.current && offset !== 0 && go( offset )}
              />
            )
          })}
        </div>

        <button type='button' className={clsx(styles.arrow, styles.next)} onClick={() => go( 1 )} aria-label={translate({ id: 'home.screenshots.next', message: 'Next screenshot' })}>
          <Icon icon='mdi:chevron-right' />
        </button>
      </div>

      <p className={styles.caption} aria-live='polite'>
        {screenshots[active].caption}
        <span className={styles.counter}>{active + 1} / {count}</span>
      </p>
    </section>
  )
}
