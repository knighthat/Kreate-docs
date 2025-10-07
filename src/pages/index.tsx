import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HomepageDoctype from '@site/src/components/homepage/doctype';
import Banner from '../components/homepage/banner';


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      {/* <img src='/img/banner.webp' alt='banner' /> */}
      <Banner />
      
      <main>
        <HomepageDoctype />
      </main>
    </Layout>
  );
}
