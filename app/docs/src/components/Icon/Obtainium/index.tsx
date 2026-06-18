import React, { type ReactNode, SVGProps } from 'react';


export default function Obtainium({ ...props }: SVGProps<SVGSVGElement>): ReactNode {
  return <img alt='Obtainium logo' src='/vector/logo-obtainium.svg' {...props} />
}