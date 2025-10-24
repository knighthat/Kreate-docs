import React, { type ReactNode, useState, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { Icon as IconifyIcon, IconProps as IconifyProps } from '@iconify/react';


interface Props {
  colorDark?: string
}

export type IconProps = Props & IconifyProps

export default function Icon({ color, colorDark, ...props }: IconProps): ReactNode {
  const { colorMode } = useColorMode();
    const [iconColor, setIconColor] = useState('var(--ifm-color-emphasis-1000)')
    useEffect(() => {
        const newColor = colorMode == 'dark' && colorDark
          ? colorDark
          : color || 'var(--ifm-color-emphasis-1000)';
  
        setIconColor(newColor);
    }, [colorMode]);

  return <IconifyIcon color={iconColor} {...props} />
}