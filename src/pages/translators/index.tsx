import type { ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, { translate } from '@docusaurus/Translate';

import rawJson from '@site/.generated/translators.json';
import { APP_NAME } from '@site/constants';
import styles from './styles.module.css';


type Translator = {
  user: { name: string, avatar: string, joined: string }
  languages: { id: string, name: string }[]
  translated: number
};

/** Redirects to the Crowdin project (vercel.json). A plain <a>: it isn't a site route. */
const TRANSLATE_URL = '/translate';

// .generated/translators.json is built by crowdin-translators.js; sort here
// rather than relying on its order.
const translators = ( rawJson as Translator[] )
  .slice()
  .sort( ( a, b ) => b.translated - a.translated );

/** Crowdin gives "YYYY-MM-DD hh:mm:ss" in UTC. */
function parseJoined( joined: string ): Date | undefined {
  const date = new Date( `${joined.replace( ' ', 'T' )}Z` );
  return Number.isNaN( date.getTime() ) ? undefined : date;
}


function TranslatorCard( { translator, words, months }: { translator: Translator, words: Intl.NumberFormat, months: Intl.DateTimeFormat } ): ReactNode {
  const { user, languages, translated } = translator;
  const joined = parseJoined( user.joined );

  return (
    <li className={styles.card}>
      <img className={styles.avatar} src={user.avatar} alt='' loading='lazy' width={56} height={56} />

      <div className={styles.info}>
        <span className={styles.name} title={user.name}>{user.name}</span>

        <ul className={styles.languages} aria-label={translate({ id: 'translators.languages', message: 'Languages' })}>
          {languages.map( language => <li key={language.id} className={styles.language}>{language.name}</li> )}
        </ul>

        <div className={styles.meta}>
          <span>
            <Translate
              id='translators.words'
              description='Number of words a translator has translated; {count} is already formatted'
              values={{ count: <strong>{words.format( translated )}</strong> }}
            >
              {'{count} words'}
            </Translate>
          </span>
          {joined && (
            <span>
              <Translate id='translators.since' description='{date} is a month and year, e.g. "Apr 2025"' values={{ date: <strong><time dateTime={joined.toISOString()}>{months.format( joined )}</time></strong> }}>
                {'Since {date}'}
              </Translate>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}


export default function Translators(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const words = new Intl.NumberFormat( i18n.currentLocale );
  // UTC so the server render and the browser agree on the month.
  const months = new Intl.DateTimeFormat( i18n.currentLocale, { year: 'numeric', month: 'short', timeZone: 'UTC' } );

  return (
    <Layout
      title={translate({ id: 'translators.title', message: 'Translators' })}
      description={translate({ id: 'translators.description', message: 'Turning English into your native language' })}
    >
      <main className={clsx('container', styles.page)}>
        <header className={styles.header}>
          <div>
            <h1><Translate id='translators.heading'>Translators</Translate></h1>
            <p className={styles.lead}>
              <Translate id='translators.lead' values={{ app: APP_NAME, count: translators.length }}>
                {'{app} is translated by {count} volunteers. Thank you for bringing it to your language.'}
              </Translate>
            </p>
          </div>
          <a className='button button--primary' href={TRANSLATE_URL} target='_blank' rel='noopener noreferrer'>
            <Translate id='translators.join'>Help translate</Translate>
          </a>
        </header>

        <ol className={styles.grid}>
          {translators.map( t => <TranslatorCard key={t.user.name} translator={t} words={words} months={months} /> )}
        </ol>
      </main>
    </Layout>
  );
}
