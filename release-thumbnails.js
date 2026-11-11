/**
 * Draws a thumbnail for every release post that has no `image` in its front matter:
 * the version (e.g. "v2.2.5") in JetBrains Mono, centered on static/img/blog_background.png.
 *
 * Used as the `processBlogPosts` hook of the releases blog (see docusaurus.config.ts).
 * The version comes from `version:` in front matter, else from the first "1.2.3" in the
 * title. Images land in .generated/static (gitignored, served like static/) and are named
 * by a hash of their inputs, so changing the base image or font redraws them all.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

// Docusaurus loads config files as CommonJS, so `import.meta` isn't available here.
const ROOT = __dirname;
const BASE_IMAGE = path.join(ROOT, 'static/img/blog_background.png');
const FONT = path.join(ROOT, 'static/fonts/JetBrainsMono-ExtraBold.ttf');

export const GENERATED_STATIC_DIR = path.join(ROOT, '.generated/static');
const URL_DIR = '/img/releases/generated';
const OUT_DIR = path.join(GENERATED_STATIC_DIR, URL_DIR);

const WIDTH = 1200;
const HEIGHT = 630;
// Bump to force every thumbnail to be redrawn after changing the layout below.
const LAYOUT_VERSION = 1;

// JetBrains Mono metrics, in em: every glyph is 0.6 wide, capitals/digits are 0.73 tall.
const ADVANCE = 0.6;
const CAP_HEIGHT = 0.73;
const V_SCALE = 0.45;       // the "v" is drawn smaller than the digits
const MAX_FONT_SIZE = 300;
const MAX_TEXT_WIDTH = WIDTH - 2 * 100;

export function releaseVersion({ frontMatter, title }) {
  const raw = frontMatter.version ?? title.match(/\d+(?:\.\d+)+/)?.[0];
  return raw ? String(raw).replace(/^v/i, '') : null;
}

function svg(version, background) {
  // Shrink long versions (e.g. 2026.11.06) so they fit; short ones stay at the max size.
  const em = ADVANCE * (version.length + V_SCALE);
  const size = Math.min(MAX_FONT_SIZE, MAX_TEXT_WIDTH / em);
  const baseline = (HEIGHT + CAP_HEIGHT * size) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <image href="data:image/png;base64,${background.toString('base64')}" width="${WIDTH}" height="${HEIGHT}"/>
  <text x="${WIDTH / 2}" y="${baseline}" text-anchor="middle" fill="#fff"
        font-family="JetBrains Mono" font-weight="800" font-size="${size}">
    <tspan font-size="${size * V_SCALE}">v</tspan>${version}
  </text>
</svg>`;
}

async function draw(version, background, file) {
  const png = new Resvg(svg(version, background), {
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'JetBrains Mono' },
  }).render().asPng();
  writeFileSync(file, await sharp(png).webp({ quality: 85 }).toBuffer());
}

export async function addReleaseThumbnails({ blogPosts }) {
  const background = readFileSync(BASE_IMAGE);
  const inputsHash = createHash('sha256')
    .update(background).update(readFileSync(FONT)).update(String(LAYOUT_VERSION))
    .digest('hex');
  mkdirSync(OUT_DIR, { recursive: true });

  for (const { metadata } of blogPosts) {
    if (metadata.frontMatter.image) continue;

    const version = releaseVersion(metadata);
    if (!version) {
      console.warn(`[release-thumbnails] No version found in "${metadata.title}", skipping.`);
      continue;
    }

    const hash = createHash('sha256').update(inputsHash).update(version).digest('hex').slice(0, 8);
    const name = `v${version}-${hash}.webp`;
    const file = path.join(OUT_DIR, name);
    if (!existsSync(file)) await draw(version, background, file);

    metadata.frontMatter.image = `${URL_DIR}/${name}`;
  }
}
