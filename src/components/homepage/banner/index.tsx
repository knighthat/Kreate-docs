import clsx from 'clsx';
import type {ReactNode} from 'react';

import styles from './styles.module.css'
import { APP_PACKAGE, APP_REPO_PATH, GITHUB_URL } from '@site/constants';


type BadgeProps = {
  platform: string,
  to: string
  className?: string,
}

function Badge( { platform, className, to }: BadgeProps ): ReactNode {
  const source = `${GITHUB_URL}/${APP_REPO_PATH}/blob/main/assets/get-it-on/${platform}.png?raw=true`
  return(
    <a className={clsx('col padding--none', className || '')} href={`/download/${to}`} >
      <img className={styles.badge} src={source} alt={`${platform}'s download page`} />
    </a>
  )
}

function DownloadBadges(): ReactNode {
  return(
    <div className='container'>

      <div className='row'>

        <Badge platform='GitHub' className='col--5 col--offset-2' to='github' />
        <Badge platform='F-Droid' className='col--5' to='f-droid' />

      </div>

      <div className='row'>

        <Badge platform='IzzyOnDroid' to='izzyondroid' />
        <Badge platform='Obtainium' to='obtainium' />
        <Badge platform='OpenAPK' to='openapk' />

      </div>

    </div>
  )
}

export default function Banner(): ReactNode {
  return(
    <div className={clsx(styles.container, styles.bannerHeight)}>

      <img src='/img/banner.webp' alt='banner' className={clsx(styles.image)} />
      
      <div className={clsx(styles.content, 'container')}>

        <div className='row'>

          <div id={styles.left} className='col col--8'>
            <DownloadBadges />
          </div>

          <div id={styles.right} className='col col--4'>
            <img className='col' src='https://github.com/knighthat/Kreate/blob/main/assets/design/app_banner.png?raw=true' />
          </div>

        </div>

      </div>

    </div>
  );
}