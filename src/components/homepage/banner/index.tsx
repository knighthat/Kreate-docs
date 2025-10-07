import clsx from 'clsx';
import type {ReactNode} from 'react';

import styles from './styles.module.css'
import { APP_REPO_PATH, GITHUB_URL } from '@site/constants';


type BadgeProps = {
  platform: string,
  to: string
  className?: string,
}

function Badge( { platform, className, to }: BadgeProps ): ReactNode {
  const source = `${GITHUB_URL}/${APP_REPO_PATH}/blob/main/assets/get-it-on/${platform}.png?raw=true`
  return(
    <a className={clsx('col padding--none', className || '')} href={to} >
      <img className={styles.badge} src={source} alt={`${platform}'s download page`} />
    </a>
  )
}

const obtainiumUrl = "http://apps.obtainium.imranr.dev/redirect.html?r=obtainium://app/%7B%22id%22%3A%22me.knighthat.kreate%22%2C%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fknighthat%2FKreate%22%2C%22author%22%3A%22knighthat%22%2C%22name%22%3A%22Kreate%22%2C%22preferredApkIndex%22%3A0%2C%22additionalSettings%22%3A%22%7B%5C%22includePrereleases%5C%22%3Afalse%2C%5C%22fallbackToOlderReleases%5C%22%3Atrue%2C%5C%22filterReleaseTitlesByRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22filterReleaseNotesByRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22verifyLatestTag%5C%22%3Atrue%2C%5C%22sortMethodChoice%5C%22%3A%5C%22date%5C%22%2C%5C%22useLatestAssetDateAsReleaseDate%5C%22%3Atrue%2C%5C%22releaseTitleAsVersion%5C%22%3Afalse%2C%5C%22trackOnly%5C%22%3Afalse%2C%5C%22versionExtractionRegEx%5C%22%3A%5C%22%5C%22%2C%5C%22matchGroupToUse%5C%22%3A%5C%22%5C%22%2C%5C%22versionDetection%5C%22%3Atrue%2C%5C%22releaseDateAsVersion%5C%22%3Afalse%2C%5C%22useVersionCodeAsOSVersion%5C%22%3Afalse%2C%5C%22apkFilterRegEx%5C%22%3A%5C%22Kreate-release.apk%5C%22%2C%5C%22invertAPKFilter%5C%22%3Afalse%2C%5C%22autoApkFilterByArch%5C%22%3Atrue%2C%5C%22appName%5C%22%3A%5C%22Kreate%5C%22%2C%5C%22appAuthor%5C%22%3A%5C%22Knight%20Hat%5C%22%2C%5C%22shizukuPretendToBeGooglePlay%5C%22%3Afalse%2C%5C%22allowInsecure%5C%22%3Afalse%2C%5C%22exemptFromBackgroundUpdates%5C%22%3Afalse%2C%5C%22skipUpdateNotifications%5C%22%3Afalse%2C%5C%22about%5C%22%3A%5C%22%5C%22%2C%5C%22refreshBeforeDownload%5C%22%3Afalse%7D%22%7D"

function DownloadBadges(): ReactNode {
  return(
    <div className='container'>

      <div className='row'>

        <Badge platform='GitHub' className='col--5 col--offset-2' to={`${GITHUB_URL}/${APP_REPO_PATH}/releases/latest`} />
        <Badge platform='F-Droid' className='col--5' to='https://f-droid.org/packages/me.knighthat.kreate/' />

      </div>

      <div className='row'>

        <Badge platform='IzzyOnDroid' to='https://apt.izzysoft.de/fdroid/index/apk/me.knighthat.kreate' />
        <Badge platform='Obtainium' to={obtainiumUrl} />
        <Badge platform='OpenAPK' to='https://www.openapk.net/kreate/me.knighthat.kreate/' />

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