import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type { Props } from '@theme/Footer/Layout';
import { Icon } from '@Iconify';

import { APP_NAME, APP_REPO_PATH, GITHUB_URL } from '@site/constants';
import styles from './styles.module.css';


const socials = [
  { label: 'GitHub', icon: 'mdi:github', href: `${GITHUB_URL}/${APP_REPO_PATH}` },
  { label: 'Discord', icon: 'bi:discord', href: 'https://kreate.knighthat.me/discord' },
  { label: 'Crowdin', icon: 'simple-icons:crowdin', href: 'https://translate.kreate.knighthat.me' },
];

/**
 * Replaces the classic theme's footer layout. Link columns (`links`) and
 * `copyright` still come from `themeConfig.footer` in docusaurus.config.ts.
 */
export default function FooterLayout( { style, links, logo, copyright }: Props ): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return(
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', styles.footer, {
        'footer--dark': style === 'dark',
      })}
    >
      <div className='container container-fluid'>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link to='/' className={styles.brandName}>
              <img src='/img/logo_transparent.svg' alt='' width={40} height={40} />
              {APP_NAME}
            </Link>

            {siteConfig.tagline && <p className={styles.tagline}>{siteConfig.tagline}</p>}

            <ul className={styles.socials}>
              {socials.map( ( { label, icon, href } ) => (
                <li key={label}>
                  <a href={href} target='_blank' rel='noopener noreferrer' aria-label={label} title={label}>
                    <Icon icon={icon} aria-hidden='true' />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.links}>{links}</div>
        </div>

        {(logo || copyright) && (
          <div className={clsx('footer__bottom', styles.bottom)}>
            {logo}
            {copyright}
          </div>
        )}
      </div>
    </footer>
  )
}
