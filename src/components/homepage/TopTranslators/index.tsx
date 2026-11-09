import type { ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import translators from '@site/src/pages/translators/translators.json';
import styles from './styles.module.css';


type Translator = {
  user: { name: string, avatar: string, joined: string }
  languages: { id: string, name: string }[]
  translated: number
};

const LIMIT = 5;
const MEDALS = [ styles.gold, styles.silver, styles.bronze ];

// translators.json is refreshed by the update-translators workflow; sort here
// rather than relying on its order.
const top = ( translators as Translator[] )
  .slice()
  .sort( ( a, b ) => b.translated - a.translated )
  .slice( 0, LIMIT );

const wordFormat = new Intl.NumberFormat( 'en' );

export default function TopTranslators(): ReactNode {
  if( !top.length )
    return null

  const max = top[0].translated;

  return(
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Top translators</h2>
        <Link className={styles.all} to='/translators'>
          See all <span aria-hidden='true'>→</span>
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
              <small>words</small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
