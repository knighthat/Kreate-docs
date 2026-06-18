import React, { type ReactNode, SVGProps } from 'react';


export default function IzzyOnDroid({ ...props }: SVGProps<SVGSVGElement>): ReactNode {
  return <img alt='IzzyOnDroid logo' src='https://codeberg.org/IzzyOnDroid/repo/raw/branch/master/assets/IzzyOnDroidLogo.svg' {...props} />
}