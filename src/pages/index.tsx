import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { translate } from '@docusaurus/Translate';

import Banner from '@components/homepage/Banner';
import Features from '@components/homepage/Features';
import RecentPosts from '@components/homepage/RecentPosts';
import Screenshots from '@components/homepage/Screenshots';
import Community from '@components/homepage/Community';
import Donation from '@components/homepage/Donation';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { APP_NAME } from '@site/constants';


export default function Home(): ReactNode {
  // Set via <Head> because Layout's `title` always appends " | <site title>".
  const TITLE = `${APP_NAME} | ${translate({ id: 'home.title', message: 'Music app', description: 'Homepage <title>, shown after the app name' })}`;

  return (
    <Layout description={translate({ id: 'home.description', message: 'Feature-rich & customizable music player', description: 'Homepage meta description' })}>
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
