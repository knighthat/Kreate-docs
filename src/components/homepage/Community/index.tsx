import type { ReactNode } from 'react';
import clsx from 'clsx';

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
          <h2 className={styles.heading}>Join the community</h2>
          <Discord />
          <Crowdin />
        </div>
      </div>
    </section>
  )
}
