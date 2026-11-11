import type { ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';

import { AllBadges } from '@site/src/components/DownloadBadges';
import { APP_NAME } from '@site/constants';
import styles from './styles.module.css';


export default function Download(): ReactNode {
  return (
    <Layout
      title={translate({ id: 'download.title', message: 'Download' })}
      description={translate({ id: 'download.description', message: 'Every place you can download {app} from.' }, { app: APP_NAME })}
    >
      <main className={clsx('container', styles.page)}>
        <h1><Translate id='download.heading' values={{ app: APP_NAME }}>{'Download {app}'}</Translate></h1>
        <p className={styles.lead}>
          <Translate id='download.lead'>Pick wherever you prefer to get your apps from.</Translate>
        </p>

        <AllBadges className={styles.badges} />

        <p className={styles.verify}>
          <Translate
            id='download.verify'
            values={{ link: <Link to='/verify'><Translate id='download.verifyLink'>verify it here</Translate></Link> }}
          >
            {'Not sure an APK is genuine? You can {link}.'}
          </Translate>
        </p>
      </main>
    </Layout>
  );
}
