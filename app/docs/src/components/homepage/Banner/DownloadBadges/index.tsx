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
    <a className={clsx('padding--none', className || '')} href={`/download/${to}`} >
      <img className={styles.badge} src={source} alt={`${platform}'s download page`} />
    </a>
  )
}

export function HorizontalBagdes(): ReactNode {
  return(
    <div className='container'>

      <div className='row'>

        <Badge platform='GitHub' className='col col--5 col--offset-2' to='github' />
        <Badge platform='F-Droid' className='col col--5' to='f-droid' />

      </div>

      <div className='row'>

        <Badge platform='IzzyOnDroid' className='col' to='izzyondroid' />
        <Badge platform='Obtainium' className='col' to='obtainium' />
        <Badge platform='OpenAPK' className='col' to='openapk' />

      </div>

    </div>
  )
}

export function VerticalBadges(): ReactNode {
  return(
    <div className='container'>
      <Badge platform='GitHub' className='row flex-justc--center' to='github' />
      <Badge platform='F-Droid' className='row flex-justc--center' to='f-droid' />
      <Badge platform='IzzyOnDroid' className='row flex-justc--center' to='izzyondroid' />
      <Badge platform='Obtainium' className='row flex-justc--center' to='obtainium' />
      <Badge platform='OpenAPK' className='row flex-justc--center' to='openapk' />
    </div>
  )
}