import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import Banner from '@components/homepage/Banner';
import Features from '@components/homepage/Features';
import RecentPosts from '@components/homepage/RecentPosts';
import Screenshots from '@components/homepage/Screenshots';
import Community from '@components/homepage/Community';
import Donation from '@components/homepage/Donation';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { APP_NAME } from '@site/constants';


// Set via <Head> because Layout's `title` always appends " | <site title>".
const TITLE = `${APP_NAME} | Music app`;

export default function Home(): ReactNode {
  return (
    <Layout description="Feature-rich & customizable music player">
      <Head>
        <title>{TITLE}</title>
        <meta property="og:title" content={TITLE} />
      </Head>

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
