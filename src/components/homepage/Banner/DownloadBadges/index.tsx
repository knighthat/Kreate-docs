import type { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.css'


type BadgeProps = {
  platform: string,
  to: string
  className?: string,
}

function Badge( { platform, className, to }: BadgeProps ): ReactNode {
  const source = `/img/get-it-on/${platform}.webp`
  return(
    <a className={clsx('col padding--none', className || '')} href={`/download/${to}`} >
      <img className={styles.badge} src={source} alt={`${platform}'s download page`} />
    </a>
  )
}

export default function DownloadBadges(): ReactNode {
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