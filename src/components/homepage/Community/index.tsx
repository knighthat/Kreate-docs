import type { ReactNode } from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';

import TopTranslators from '@components/homepage/TopTranslators';
import Discord from './Discord';
import Crowdin from './Crowdin';
import styles from './styles.module.css';


export default function Community(): ReactNode {
  return(
    <section className={styles.section}>
      <div className={clsx('container', styles.grid)}>
        <TopTranslators />

        <div className={styles.side}>
          <h2 className={styles.heading}>
            <Translate id='home.community.heading'>Join the community</Translate>
          </h2>
          <Discord />
          <Crowdin />
        </div>
      </div>
    </section>
  )
}
