import fs from 'node:fs';
import path from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { APP_NAME, APP_REPO_PATH, DOC_REPO_PATH, GITHUB_URL, OWNER } from './constants';
import { addReleaseThumbnails, GENERATED_STATIC_DIR } from '#helpers/release-thumbnails.js';
import { generateReleasePosts, RELEASE_POSTS_DIR } from '#helpers/release-posts.js';

// Build-time images (release thumbnails) are served from here as well as static/.
fs.mkdirSync(GENERATED_STATIC_DIR, { recursive: true });

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
  staticDirectories: ['static', GENERATED_STATIC_DIR],
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
      // No `title` here: it would be extracted for translation. Navbar/Logo renders APP_NAME instead.
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
        // Release posts have their own section (/releases); the navbar goes to GitHub.
        { label: 'Releases', position: 'left', href: `${GITHUB_URL}/${APP_REPO_PATH}/releases` },
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
          // `brand` instead of `label` keeps brand names out of navbar.json (see NavbarNavLink)
          brand: 'Discord'
        },
        {
          position: 'right',
          href: `${GITHUB_URL}/${APP_REPO_PATH}`,
          icon: {
            icon: 'mdi:github'
          },
          brand: 'GitHub'
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
            {
              label: 'Credits',
              to: 'usr/credits',
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
        blogDir: ['blog', path.relative(__dirname, RELEASE_POSTS_DIR)],
        blogRouteBasePath: ['/blog', '/releases'],
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  // Click an image in a doc or blog post to see it full screen.
  clientModules: ['./src/clientModules/imageLightbox.ts'],

  plugins: [
    '#plugins/custom-paths.js',
    '#plugins/dev-api-proxy.js',
    ['#plugins/offline-icons.js', { prefixes: ['mdi', 'bi', 'simple-icons'] }],
    [
      // The latest GitHub releases as posts, written at build time by release-posts.js
      // (see createConfig below). A second blog, kept out of /blog but using its layout;
      // the homepage lists them as the second row of "Recent posts".
      '@docusaurus/plugin-content-blog',
      {
        id: 'releases',
        path: RELEASE_POSTS_DIR,
        routeBasePath: '/releases',
        blogTitle: 'Releases',
        blogDescription: `Every ${APP_NAME} release and its changelog`,
        blogSidebarTitle: 'All releases',
        blogSidebarCount: 'ALL',
        authorsMapPath: path.relative(RELEASE_POSTS_DIR, path.join(__dirname, 'blog/authors.yml')),
        showReadingTime: false,
        feedOptions: { type: ['rss', 'atom'], xslt: true },
        onInlineTags: 'ignore',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'ignore',
        // Posts without `image` get one drawn from their version number.
        processBlogPosts: addReleaseThumbnails,
      },
    ],
    '#plugins/recent-posts.js',
    '#plugins/crowdin-translators.js',
    '#plugins/crowdin-stats.js',
    ['#plugins/github-stats.js', { repo: APP_REPO_PATH }],
    [
      '#plugins/discord-invite.js',
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

export default async function createConfig(): Promise<Config> {
  // Must finish before the releases blog reads its folder.
  await generateReleasePosts({ repo: APP_REPO_PATH, count: 5, author: OWNER });
  return config;
}
