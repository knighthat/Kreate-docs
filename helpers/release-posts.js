/**
 * Writes one blog post per recent GitHub release (drafts and pre-releases skipped) into
 * RELEASE_POSTS_DIR, which the `releases` blog instance reads (see docusaurus.config.ts).
 *
 * Runs once when the config loads, before any plugin reads content. Set GITHUB_TOKEN to
 * raise the 60 requests/hour unauthenticated limit. If GitHub can't be reached, the
 * posts from the previous build (if any) are kept and the build carries on.
 */
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Docusaurus loads config files as CommonJS, so `import.meta` isn't available here.
export const RELEASE_POSTS_DIR = path.join(__dirname, '../.generated/releases');

const yaml = (value) => JSON.stringify(value); // a JSON string is a valid YAML scalar

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return `${bytes.toFixed(i ? 1 : 0)} ${units[i]}`;
}

/** "v2.2.3 | Hot fix" → "v2.2.3 - Hot fix"; "v2.2.5-20261106" → "v2.2.5". */
function title({ tag_name, name }) {
  const subtitle = name?.split('|').slice(1).join('|').trim();
  return subtitle ? `${tag_name} - ${subtitle}` : tag_name;
}

function post(release, author) {
  const assets = release.assets.map(
    ({ name, size, browser_download_url }) =>
      `| [${name}](${browser_download_url}) | ${formatSize(size)} |`,
  );

  return `---
title: ${yaml(title(release))}
slug: ${yaml(release.tag_name)}
date: ${release.published_at}
authors: [${author}]
version: ${yaml(release.tag_name)}
format: md
---

${(release.body ?? '').trim().replace(/\r\n/g, '\n')}

<!-- truncate -->

${assets.length ? `## Downloads

| File | Size |
| --- | --- |
${assets.join('\n')}
` : ''}
[View on GitHub](${release.html_url})
`;
}

async function fetchReleases(repo, count) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=30`, {
    headers,
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const releases = await response.json();
  return releases.filter((r) => !r.draft && !r.prerelease).slice(0, count);
}

export async function generateReleasePosts({ repo, count = 5, author }) {
  let releases;
  try {
    releases = await fetchReleases(repo, count);
  } catch (error) {
    const kept = existsSync(RELEASE_POSTS_DIR) ? readdirSync(RELEASE_POSTS_DIR).length : 0;
    console.warn(`[release-posts] Couldn't fetch releases of ${repo}: ${error.message}. Keeping ${kept} existing post(s).`);
    mkdirSync(RELEASE_POSTS_DIR, { recursive: true });
    return;
  }

  rmSync(RELEASE_POSTS_DIR, { recursive: true, force: true });
  mkdirSync(RELEASE_POSTS_DIR, { recursive: true });
  for (const release of releases) {
    const date = release.published_at.slice(0, 10);
    writeFileSync(path.join(RELEASE_POSTS_DIR, `${date}-${release.tag_name}.md`), post(release, author));
  }
}
