import fs from 'node:fs';
import path from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { APP_NAME, APP_REPO_PATH, DOC_REPO_PATH, GITHUB_URL, OWNER } from './constants';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Docusaurus doesn't read .env itself. Load it for local builds (CROWDIN_TOKEN, GITHUB_TOKEN...);
// on CI/Vercel the variables come from the environment and there is no file.
try {
  process.loadEnvFile();
} catch {}

// Every folder in i18n/ is a locale (pulled from Crowdin). `en` is skipped because
// i18n/en/ only holds the source strings uploaded to Crowdin.
const I18N_DIR = path.join(__dirname, 'i18n');
const LOCALES = [
  'en',
  ...(fs.existsSync(I18N_DIR)
    ? fs.readdirSync(I18N_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name !== 'en')
        .map((entry) => entry.name)
        .sort()
    : []),
];

const config: Config = {
  title: APP_NAME,
  tagline: 'Music your way',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: `https://${APP_NAME.toLowerCase()}.${OWNER}.me`,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: OWNER, // Usually your GitHub org/user name.
  projectName: APP_NAME, // Usually your repo name.

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: LOCALES,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `${GITHUB_URL}/${DOC_REPO_PATH}/tree/main`,
          path: 'docs',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `${GITHUB_URL}/${DOC_REPO_PATH}/tree/main`,
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          routeBasePath: '/blog'
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          // Tag and archive listings are thin, duplicate content
          ignorePatterns: ['/tags/**', '/blog/tags/**', '/blog/archive', '/blog/page/**'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.webp',
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
        { label: 'Download', position: 'left', to: 'download' },
        { type: 'search', position: 'right' },
        // Top row of the mobile menu; on desktop it's left of Discord.
        { type: 'custom-repoStats', position: 'right' },
        {
          position: 'right',
          href: "https://kreate.knighthat.me/discord",
          icon: {
            icon: 'bi:discord'
          },
          label: 'Discord'
        },
        {
          position: 'right',
          href: `${GITHUB_URL}/${APP_REPO_PATH}`,
          icon: {
            icon: 'mdi:github'
          },
          label: 'Github'
        },
        // Hidden until at least one translation exists.
        ...(LOCALES.length > 1 ? [{ type: 'localeDropdown', position: 'right' } as const] : []),
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
        {
          title: 'Special thanks',
          items: [
            {
              label: 'Translators',
              to: 'translators',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ${APP_NAME}. Built with <a href='https://docusaurus.io/' target="_blank">Docusaurus</a>. Powered by <a href='https://vercel.com/' target="_blank">Vercel</a>`,
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
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    }
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      // Builds the index at build time: no external service, but search only works
      // in `pnpm build`/`serve`, not in `pnpm start`.
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        // Docs are served from the site root (see `routeBasePath` above).
        docsRouteBasePath: '/',
        blogRouteBasePath: '/blog',
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  plugins: [
    './custom-paths-plugin.js',
    ['./offline-icons-plugin.js', { prefixes: ['mdi', 'bi', 'simple-icons'] }],
    './recent-posts-plugin.js',
    './crowdin-stats-plugin.js',
    ['./github-stats-plugin.js', { repo: APP_REPO_PATH }],
    [
      './discord-invite-plugin.js',
      {
        code: 'WYr9ZgJzpx',
        fallback: {
          name: 'Kreate - Music App',
          description: 'A multilingual YouTube Music frontend for Android, prioritize performance',
        },
      },
    ],
    [
      'vercel-analytics',
      {
        debug: false,
        mode: 'auto',
      },
    ],
  ],

  scripts: [
    {
      src: "https://keepandroidopen.org/banner.js",
      async: true,  
      defer: false,  
      crossorigin: 'anonymous',  
    }
  ]
};

export default config;
