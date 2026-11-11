import type { ReactNode } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';

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
      <img className={styles.badge} src={source} alt={translate(
        { id: 'home.badge.alt', message: '{platform} download page', description: 'Alt text of a "Get it on" badge; {platform} is a store name like F-Droid' },
        { platform },
      )} />
    </a>
  )
}

export function InlineBadges( { className }: { className?: string } ): ReactNode {
  return(
    <div className={className}>
      <Badge platform='GitHub' to='github' />
      <Badge platform='F-Droid' to='f-droid' />
      <Badge platform='IzzyOnDroid' to='izzyondroid' />
    </div>
  )
}