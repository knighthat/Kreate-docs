import React, {type ReactNode, useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {isRegexpStringMatch} from '@docusaurus/theme-common';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/NavbarItem/NavbarNavLink';
import { useColorMode } from '@docusaurus/theme-common';

import { Icon } from '@iconify/react';


interface IconProps {
  name: string
  color?: string
  colorDark?: string
}

interface NavItenProps extends Props {
  icon?: IconProps
}

function NavLinkIcon({ icon: { name, color, colorDark } }: { icon: IconProps }): ReactNode {
  const { colorMode } = useColorMode();
  const [iconColor, setIconColor] = useState('var(--ifm-color-emphasis-1000)')
  useEffect(() => {
      const newColor = colorMode == 'dark' && colorDark
        ? colorDark
        : color || 'var(--ifm-color-emphasis-1000)';

      setIconColor(newColor);
  }, [colorMode]);

  return (
    <div className="row">
      <Icon 
        icon={name} 
        className='col' 
        width='1.7rem' 
        color={iconColor} />
    </div>
  )
}

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  icon,
  ...props
}: NavItenProps): ReactNode {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});
  const isExternalLink = label && href && !isInternalUrl(href);


  // Link content is set through html, icon, XOR label
  const linkContentProps = icon
    ? {
      children: (
        <NavLinkIcon icon={icon} />
      )
    }
    : html
    ? {dangerouslySetInnerHTML: {__html: html}}
    : {
        children: (
          <>
            {label}
            {isExternalLink && (
              <IconExternalLink
                {...(isDropdownLink && {width: 12, height: 12})}
              />
            )}
          </>
        ),
      };

  if (href) {
    return (
      <Link
        href={prependBaseUrlToHref ? normalizedHref : href}
        {...props}
        {...linkContentProps}
      />
    );
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl),
      })}
      {...props}
      {...linkContentProps}
    />
  );
}
