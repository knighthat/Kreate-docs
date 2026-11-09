import type { ReactNode, CSSProperties } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';

import translators from '@site/src/pages/translators/translators.json';
import styles from './crowdin.module.css';


/** Redirects to the Kreate project on Crowdin. */
const TRANSLATE_URL = 'https://translate.kreate.knighthat.me';
/** Where people ask for a language that isn't set up yet. */
const REQUEST_LANGUAGE_URL = 'https://crowdin.com/project/kreate/discussions';

type CrowdinStats = {
  available: boolean
  languages: number | null
  progress: number | null
  completed: number | null
};

// Fallbacks from translators.json, used when the Crowdin API isn't reachable at build time.
const translatorCount = translators.length;
const contributedLanguages = new Set( translators.flatMap( t => t.languages.map( l => l.id ) ) ).size;

export default function Crowdin(): ReactNode {
  const stats = usePluginData( 'crowdin-stats-plugin' ) as CrowdinStats;

  const metrics = [
    stats.available && { value: `${stats.progress}%`, label: 'Translated' },
    { value: stats.languages ?? contributedLanguages, label: 'Languages' },
    { value: translatorCount, label: 'Translators' },
  ].filter( Boolean ) as { value: string | number, label: string }[];

  return(
    <div className={styles.card}>
      <img className={styles.logo} src='/vector/crowdin-light.svg' alt='Crowdin' width={180} height={37} />

      <dl className={styles.metrics}>
        {metrics.map( ( { value, label } ) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {stats.available && (
        <div className={styles.progress} style={{ '--progress': `${stats.progress}%` } as CSSProperties}>
          <span className={styles.progressBar} aria-hidden='true' />
          {stats.completed !== null && (
            <span className={styles.progressNote}>
              {stats.completed} of {stats.languages} languages fully translated
            </span>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <a className={styles.solid} href={TRANSLATE_URL} target='_blank' rel='noopener noreferrer'>
          Translate
        </a>
        <a className={styles.outline} href={REQUEST_LANGUAGE_URL} target='_blank' rel='noopener noreferrer'>
          Request language
        </a>
      </div>
    </div>
  )
}
