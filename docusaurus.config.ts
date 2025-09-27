import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { APP_NAME, APP_REPO_PATH, DOC_REPO_PATH, GITHUB_URL, OWNER } from './constants';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: APP_NAME,
  tagline: 'Music your way',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: `https://${APP_NAME}.${OWNER}.me`,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: OWNER, // Usually your GitHub org/user name.
  projectName: APP_NAME, // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `${GITHUB_URL}/${DOC_REPO_PATH}`,
          path: 'docs',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/knighthat/Kreate-docs/blog',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          routeBasePath: '/blog'
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: APP_NAME,
      logo: {
        alt: `${APP_NAME}\'s logo`,
        src: 'img/logo_transparent.svg',
      },
      items: [
        {
          label: 'I\'m a',
          position: 'left',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'devDocSidebar',
              label: 'Developers',
              to: '/dev'
            },
            {
              type: 'docSidebar',
              sidebarId: 'usrDocSidebar',
              label: 'Users',
              to: '/usr'
            }
          ]
        },
        { label: 'Blog', position: 'left', to: 'blog' },
        {
          label: 'Discord',
          position: 'right',
          href: "https://kreate.knighthat.me/discord"
        },
        {
          label: 'Download',
          position: 'right',
          href: "https://github.com/knighthat/Kreate/releases/latest"
        },
        {
          label: 'Sources',
          position: 'right',
          items: [
            {
              label: 'App source',
              href: `${GITHUB_URL}/${APP_REPO_PATH}`
            },
            {
              label: 'Docs source',
              href: `${GITHUB_URL}/${DOC_REPO_PATH}`
            },
          ]
        }
        
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'For developers',
              to: '/dev',
            },
            {
              label: 'For users',
              to: '/usr',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github Discussion',
              href: `${GITHUB_URL}/${APP_REPO_PATH}/discussions`
            },
            {
              label: 'Discord Server',
              href: 'https://kreate.knighthat.me/discord'
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'About KnightHat',
              href: `${GITHUB_URL}/${OWNER}`,
            },
            {
              label: 'About Kreate',
              href: `${GITHUB_URL}/${APP_REPO_PATH}`,
            },
            {
              label: 'Source code',
              href: `${GITHUB_URL}/${DOC_REPO_PATH}`,
            },
            {
              label: 'Blogs',
              to: 'blog'
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ${APP_NAME}. Built with <a href='https://docusaurus.io/' target="_blank">Docusaurus</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['diff', 'bash', 'markdown', 'git']
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
