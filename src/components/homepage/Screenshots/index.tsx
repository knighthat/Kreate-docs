import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';

import styles from './styles.module.css';


type Screenshot = {
  file: string
  caption: string
};

const screenshots: Screenshot[] = [
  { file: '01-player', caption: 'Player' },
  { file: '02-queue', caption: 'Queue' },
  { file: '03-lyrics', caption: 'Lyrics' },
  { file: '04-songs', caption: 'Songs' },
  { file: '05-albums', caption: 'Albums' },
  { file: '06-artists', caption: 'Artists' },
  { file: '07-playlists', caption: 'Playlists' },
  { file: '08-album-details', caption: 'Album details' },
  { file: '08-album-details-2', caption: 'Album details' },
  { file: '08-album-details-3', caption: 'Album details' },
  { file: '09-artist-details', caption: 'Artist details' },
  { file: '09-artist-details-2', caption: 'Artist details' },
  { file: '09-artist-details-3', caption: 'Artist details' },
  { file: '10-playlist-details', caption: 'Playlist details' },
  { file: '10-playlist-details-2', caption: 'Playlist details' },
  { file: '10-playlist-details-3', caption: 'Playlist details' },
  { file: '11-history', caption: 'History' },
  { file: '12-statistics', caption: 'Statistics' },
  { file: '13-search-suggestions', caption: 'Search suggestions' },
  { file: '14-album-menu', caption: 'Album menu' },
  { file: '15-artist-menu', caption: 'Artist menu' },
  { file: '16-playlist-menu', caption: 'Playlist menu' },
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
      aria-label='App screenshots'
      onMouseEnter={() => setPaused( true )}
      onMouseLeave={() => setPaused( false )}
      onFocus={() => setPaused( true )}
      onBlur={() => setPaused( false )}
    >
      <div className={styles.viewport}>
        <button type='button' className={clsx(styles.arrow, styles.prev)} onClick={() => go( -1 )} aria-label='Previous screenshot'>
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
                alt={offset === 0 ? `${caption} screen` : ''}
                aria-hidden={offset !== 0}
                width={1080}
                height={2400}
                draggable={false}
                onClick={() => !swiped.current && offset !== 0 && go( offset )}
              />
            )
          })}
        </div>

        <button type='button' className={clsx(styles.arrow, styles.next)} onClick={() => go( 1 )} aria-label='Next screenshot'>
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
