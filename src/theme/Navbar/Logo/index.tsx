import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useThemeConfig } from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';

import { APP_NAME } from '@site/constants';

/**
 * Navbar brand with a hard-coded title. Setting `navbar.title` in the config
 * would put the app name into navbar.json for translation.
 */
export default function NavbarLogo(): ReactNode {
  const { navbar: { logo } } = useThemeConfig();
  const logoLink = useBaseUrl(logo?.href || '/');
  const sources = {
    light: useBaseUrl(logo?.src),
    dark: useBaseUrl(logo?.srcDark || logo?.src),
  };

  return (
    <Link
      to={logoLink}
      className="navbar__brand"
      {...(logo?.target && { target: logo.target })}>
      {logo && (
        <div className="navbar__logo">
          <ThemedImage
            className={logo.className}
            sources={sources}
            height={logo.height}
            width={logo.width}
            alt={logo.alt ?? ''}
            style={logo.style}
          />
        </div>
      )}
      <b className="navbar__title text--truncate">{APP_NAME}</b>
    </Link>
  );
}
