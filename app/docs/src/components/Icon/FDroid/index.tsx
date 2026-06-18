import React, { type ReactNode, SVGProps } from 'react';


export default function FDroid({ ...props }: SVGProps<SVGSVGElement>): ReactNode {
  return <img alt='FDroid logo' src='https://gitlab.com/fdroid/fdroid-website/-/raw/master/assets/fdroid-logo.svg' {...props} />
}