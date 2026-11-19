import type { ComponentProps, ReactNode } from 'react';


export default function OpenAPK({ ...props }: ComponentProps<'img'>): ReactNode {
  return <img alt='OpenAPK logo' src='/vector/logo-openapk.svg' {...props} />
}