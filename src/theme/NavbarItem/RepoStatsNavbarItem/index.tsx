import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '@Iconify';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';

import styles from './styles.module.css';


type RepoStats = {
  stars: number | null
  forks: number | null
};

type Props = {
  mobile?: boolean
};

/**
 * Star and fork counts of the app repository (from github-stats-plugin, at build time).
 * Desktop: sits in the right side of the navbar. Mobile: first row of the sidebar menu.
 */
export default function RepoStatsNavbarItem( { mobile }: Props ): ReactNode {
  const { stars, forks } = usePluginData( 'github-stats-plugin' ) as RepoStats;
  const { i18n } = useDocusaurusContext();
  if( stars === null && forks === null ) return null;

  const compactFormat = new Intl.NumberFormat( i18n.currentLocale, { notation: 'compact', maximumFractionDigits: 1 } );
  const fullFormat = new Intl.NumberFormat( i18n.currentLocale );

  const stats = [
    {
      key: 'stars', icon: 'mdi:star-outline', count: stars,
      title: ( count: string ) => translate({ id: 'navbar.repoStats.stars', message: '{count} Stars' }, { count }),
      label: ( count: string ) => translate({ id: 'navbar.repoStats.starsLabel', message: '{count} Stars on GitHub' }, { count }),
    },
    {
      key: 'forks', icon: 'mdi:source-fork', count: forks,
      title: ( count: string ) => translate({ id: 'navbar.repoStats.forks', message: '{count} Forks' }, { count }),
      label: ( count: string ) => translate({ id: 'navbar.repoStats.forksLabel', message: '{count} Forks on GitHub' }, { count }),
    },
  ].filter( s => s.count !== null );

  const items = stats.map( s => (
    <span
      key={s.key}
      className={styles.stat}
      title={s.title( fullFormat.format( s.count! ) )}
      aria-label={s.label( fullFormat.format( s.count! ) )}
    >
      <Icon icon={s.icon} aria-hidden='true' />
      {compactFormat.format( s.count! )}
    </span>
  ));

  return mobile
    ? <li className={clsx( 'menu__list-item', styles.mobileRow )}>{items}</li>
    : <div className={clsx( 'navbar__item', styles.desktopRow )}>{items}</div>
}
