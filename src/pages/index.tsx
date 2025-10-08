import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

import HomepageDoctype from '@site/src/components/homepage/Doctype';
import Banner from '../components/homepage/Banner';
import { useWindowDimensions } from '../util/DimensionUtils';
import { VerticalBadges } from '../components/homepage/Banner/DownloadBadges';


function Badges() {
  const {width} = useWindowDimensions()

  if( width > 996 )
    return <></>
  else
    return(
      <section className='padding-vert--xl'>
        <VerticalBadges />
      </section>
    )
}

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

        <BrowserOnly>
          { () => <Badges /> }
        </BrowserOnly>
      </main>
    </Layout>
  );
}
