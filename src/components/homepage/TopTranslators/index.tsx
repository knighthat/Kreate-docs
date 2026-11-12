import type { ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';

import translators from '@site/.generated/translators.json';
import styles from './styles.module.css';


type Translator = {
  user: { name: string, avatar: string, joined: string }
  languages: { id: string, name: string }[]
  translated: number
};

const LIMIT = 5;
const MEDALS = [ styles.gold, styles.silver, styles.bronze ];

// .generated/translators.json is built by crowdin-translators-plugin.js; sort here
// rather than relying on its order.
const top = ( translators as Translator[] )
  .slice()
  .sort( ( a, b ) => b.translated - a.translated )
  .slice( 0, LIMIT );

export default function TopTranslators(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const wordFormat = new Intl.NumberFormat( i18n.currentLocale );

  if( !top.length )
    return null

  const max = top[0].translated;

  return(
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          <Translate id='home.translators.heading'>Top translators</Translate>
        </h2>
        <Link className={styles.all} to='/translators'>
          <Translate id='home.translators.seeAll'>See all</Translate> <span aria-hidden='true'>→</span>
        </Link>
      </div>

      <ol className={styles.list}>
        {top.map( ( { user, languages, translated }, index ) => (
          <li
            key={user.name}
            className={clsx(styles.row, MEDALS[index])}
            style={{ '--share': translated / max } as CSSProperties}
          >
            <span className={styles.rank}>{index + 1}</span>

            <img className={styles.avatar} src={user.avatar} alt='' loading='lazy' width={48} height={48} />

            <div className={styles.info}>
              <span className={styles.name}>{user.name}</span>
              <span className={styles.languages}>
                {languages.map( language => language.name ).join( ', ' )}
              </span>
              <span className={styles.bar} aria-hidden='true' />
            </div>

            <span className={styles.words}>
              {wordFormat.format( translated )}
              <small><Translate id='home.translators.words' description='Unit under a translated-words count'>words</Translate></small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
