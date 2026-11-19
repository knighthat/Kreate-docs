import type { ComponentProps, ReactNode } from 'react';


export default function FDroid({ ...props }: ComponentProps<'img'>): ReactNode {
  return <img alt='FDroid logo' src='https://gitlab.com/fdroid/fdroid-website/-/raw/master/assets/fdroid-logo.svg' {...props} />
}