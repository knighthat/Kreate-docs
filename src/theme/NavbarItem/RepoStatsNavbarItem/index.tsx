import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import { usePluginData } from '@docusaurus/useGlobalData';

import styles from './styles.module.css';


type RepoStats = {
  stars: number | null
  forks: number | null
};

type Props = {
  mobile?: boolean
};

const compactFormat = new Intl.NumberFormat( 'en', { notation: 'compact', maximumFractionDigits: 1 } );
const fullFormat = new Intl.NumberFormat( 'en' );

/**
 * Star and fork counts of the app repository (from github-stats-plugin, at build time).
 * Desktop: sits in the right side of the navbar. Mobile: first row of the sidebar menu.
 */
export default function RepoStatsNavbarItem( { mobile }: Props ): ReactNode {
  const { stars, forks } = usePluginData( 'github-stats-plugin' ) as RepoStats;
  if( stars === null && forks === null ) return null;

  const stats = [
    { label: 'Stars', icon: 'mdi:star-outline', count: stars },
    { label: 'Forks', icon: 'mdi:source-fork', count: forks },
  ].filter( s => s.count !== null );

  const items = stats.map( s => (
    <span
      key={s.label}
      className={styles.stat}
      title={`${fullFormat.format( s.count! )} ${s.label}`}
      aria-label={`${fullFormat.format( s.count! )} ${s.label} on GitHub`}
    >
      <Icon icon={s.icon} aria-hidden='true' />
      {compactFormat.format( s.count! )}
    </span>
  ));

  return mobile
    ? <li className={clsx( 'menu__list-item', styles.mobileRow )}>{items}</li>
    : <div className={clsx( 'navbar__item', styles.desktopRow )}>{items}</div>
}
