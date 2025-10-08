import clsx from 'clsx';
import type { ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './styles.module.css'
import { useWindowDimensions } from '@site/src/util/DimensionUtils';
import { HorizontalBagdes } from './DownloadBadges';


function Content(): ReactNode {
  const {width} = useWindowDimensions();

  if( width > 996 )
    return(
      <div className={clsx(styles.content, 'container')}>
        <div className='row'>
          <div id={styles.left} className='col col--8'>
            <HorizontalBagdes />
          </div>
          <div id={styles.right} className='col col--4'>
            <img className='col' src='/img/banner-slogan.webp' />
          </div>
        </div>
      </div>
    )
  else
    return <></>
}


export default function Banner(): ReactNode {
  return(
    <div className={clsx(styles.container, styles.bannerHeight)}>
      <img src='/img/banner.webp' alt='banner' className={clsx(styles.image)} />
      <BrowserOnly>
        { () => <Content /> }
      </BrowserOnly>
    </div>
  )
}