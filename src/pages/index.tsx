import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import HomepageDoctype from '@components/homepage/Doctype';
import Banner from '@components/homepage/Banner';
import Features from '@components/homepage/Features';
import RecentPosts from '@components/homepage/RecentPosts';
import Screenshots from '@components/homepage/Screenshots';
import Community from '@components/homepage/Community';
import Donation from '@components/homepage/Donation';
import { SpeedInsights } from '@vercel/speed-insights/react';


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Banner />

      <main>
        <Screenshots />
        <Features />
        <RecentPosts />
        <Community />
        <Donation />
      </main>

      <SpeedInsights />
    </Layout>
  );
}
