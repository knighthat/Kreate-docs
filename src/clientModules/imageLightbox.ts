/**
 * Click (or Enter/Space on) an image in a doc or blog post to see it full screen.
 * Click anywhere or press Escape to close.
 *
 * Small inline images (icons next to text) and images inside links are left alone.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const IMAGES = '.markdown img';
/** Images rendered narrower than this are icons, not screenshots. */
const MIN_WIDTH = 64;

function isZoomable( img: HTMLImageElement ): boolean {
  return !img.closest( 'a' ) && img.width >= MIN_WIDTH;
}

let overlay: HTMLDivElement | null = null;
let opener: HTMLImageElement | null = null;

function close(): void {
  if( !overlay ) return;
  overlay.remove();
  overlay = null;
  document.documentElement.classList.remove( 'lightbox-open' );
  document.removeEventListener( 'keydown', onKeyDown, true );
  opener?.focus( { preventScroll: true } );
  opener = null;
}

function onKeyDown( event: KeyboardEvent ): void {
  if( event.key === 'Escape' || event.key === 'Tab' ) {
    // Tab too: the overlay has nothing else to focus, so leaving it means closing it.
    event.preventDefault();
    close();
  }
}

function open( img: HTMLImageElement ): void {
  close();
  opener = img;

  overlay = document.createElement( 'div' );
  overlay.className = 'lightbox';
  overlay.setAttribute( 'role', 'dialog' );
  overlay.setAttribute( 'aria-modal', 'true' );
  overlay.setAttribute( 'aria-label', img.alt || 'Image' );
  overlay.tabIndex = -1;

  const big = document.createElement( 'img' );
  big.src = img.currentSrc || img.src;
  big.alt = img.alt;
  // Shown at its real size, shrunk to fit the screen; never enlarged, so it stays sharp.
  big.className = 'lightbox__image';

  const button = document.createElement( 'button' );
  button.type = 'button';
  button.className = 'lightbox__close';
  button.setAttribute( 'aria-label', 'Close' );
  button.textContent = '×';

  overlay.append( big, button );
  // Any click closes it, the image included: there is nothing to interact with inside.
  overlay.addEventListener( 'click', close );

  document.body.append( overlay );
  document.documentElement.classList.add( 'lightbox-open' );
  document.addEventListener( 'keydown', onKeyDown, true );
  overlay.focus();
}

/** Makes zoomable images reachable and announced by keyboard and screen readers. */
function markImages(): void {
  document.querySelectorAll<HTMLImageElement>( IMAGES ).forEach( img => {
    const mark = () => {
      if( !isZoomable( img ) || img.classList.contains( 'zoomable' ) ) return;
      img.classList.add( 'zoomable' );
      img.tabIndex = 0;
      img.setAttribute( 'role', 'button' );
      img.setAttribute( 'aria-label', `${img.alt || 'Image'}, open full screen` );
    };
    // Images with width/height attributes are laid out before they load; others aren't until then.
    if( img.complete || img.width > 0 ) mark();
    else img.addEventListener( 'load', mark, { once: true } );
  });
}

if( ExecutionEnvironment.canUseDOM ) {
  document.addEventListener( 'click', event => {
    const img = ( event.target as Element | null )?.closest?.( IMAGES ) as HTMLImageElement | null;
    if( img && isZoomable( img ) ) open( img );
  });

  document.addEventListener( 'keydown', event => {
    const img = event.target as HTMLElement;
    if( ( event.key === 'Enter' || event.key === ' ' ) && img.matches?.( `${IMAGES}.zoomable` ) ) {
      event.preventDefault();
      open( img as HTMLImageElement );
    }
  });
}

export function onRouteDidUpdate(): void {
  // Leaving the page (back button) shouldn't leave the overlay behind.
  close();
  markImages();
}
