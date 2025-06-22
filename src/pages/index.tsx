import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

import HomepageDoctype from '@site/src/components/homepage/doctype';
import Banners from '@site/src/components/homepage/banner';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={styles.heroBanner}>
        <div className="container">
          <Banners />
        </div>
      </header>
      
      <main>
        <HomepageDoctype />
      </main>
    </Layout>
  );
}
