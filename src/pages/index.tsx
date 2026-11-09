import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HomepageDoctype from '@components/homepage/Doctype';
import Banner from '@components/homepage/Banner';
import Features from '@components/homepage/Features';
import { SpeedInsights } from '@vercel/speed-insights/react';


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Banner />

      <main>
        <Features />
        <HomepageDoctype />
      </main>

      <SpeedInsights />
    </Layout>
  );
}
