import type { ComponentProps, ReactNode } from 'react';


export default function Obtainium({ ...props }: ComponentProps<'img'>): ReactNode {
  return <img alt='Obtainium logo' src='/vector/logo-obtainium.svg' {...props} />
}