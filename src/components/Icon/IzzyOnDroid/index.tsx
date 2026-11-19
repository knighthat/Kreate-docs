import type { ComponentProps, ReactNode } from 'react';


export default function IzzyOnDroid({ ...props }: ComponentProps<'img'>): ReactNode {
  return <img alt='IzzyOnDroid logo' src='https://codeberg.org/IzzyOnDroid/repo/raw/branch/master/assets/IzzyOnDroidLogo.svg' {...props} />
}