import type { ReactNode, CSSProperties } from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import Translate, { translate } from '@docusaurus/Translate';

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
    stats.available && { value: `${stats.progress}%`, label: translate({ id: 'home.crowdin.translated', message: 'Translated', description: 'Label above the overall translation percentage' }) },
    { value: stats.languages ?? contributedLanguages, label: translate({ id: 'home.crowdin.languages', message: 'Languages', description: 'Label above the number of languages' }) },
    { value: translatorCount, label: translate({ id: 'home.crowdin.translators', message: 'Translators', description: 'Label above the number of translators' }) },
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
              <Translate
                id='home.crowdin.completed'
                values={{ completed: stats.completed, total: stats.languages }}
              >
                {'{completed} of {total} languages fully translated'}
              </Translate>
            </span>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <a className={styles.solid} href={TRANSLATE_URL} target='_blank' rel='noopener noreferrer'>
          <Translate id='home.crowdin.translate' description='Button that opens the Crowdin project'>Translate</Translate>
        </a>
        <a className={styles.outline} href={REQUEST_LANGUAGE_URL} target='_blank' rel='noopener noreferrer'>
          <Translate id='home.crowdin.requestLanguage'>Request language</Translate>
        </a>
      </div>
    </div>
  )
}
