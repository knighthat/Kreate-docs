import React, { type ReactNode, SVGProps } from 'react';


export default function OpenAPK({ ...props }: SVGProps<SVGSVGElement>): ReactNode {
  return <img alt='FDroid logo' src='/vector/logo-openapk.svg' {...props} />
}