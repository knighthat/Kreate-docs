import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

/**
 * Bundles the Iconify icons the site uses, so browsers never call api.iconify.design.
 *
 * At build time it scans source files for icon names like 'mdi:github', takes just
 * those icons from the installed @iconify-json/<prefix> packages, and registers them
 * with @iconify/react through a client module (which also runs during SSR).
 *
 * Adding a new icon: just use it. To use a new icon set, install @iconify-json/<prefix>
 * and add the prefix to `prefixes` in docusaurus.config.ts.
 */
const require = createRequire(import.meta.url);
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

/** Copies one icon (following aliases) from a full collection into a subset. */
function copyIcon(collection, subset, name) {
  if (collection.icons[name]) {
    subset.icons[name] = collection.icons[name];
    return true;
  }
  const alias = collection.aliases?.[name];
  if (alias && copyIcon(collection, subset, alias.parent)) {
    subset.aliases[name] = alias;
    return true;
  }
  return false;
}

export default function OfflineIconsPlugin(context, { prefixes, scan = ['src', 'docusaurus.config.ts'] }) {
  const pattern = new RegExp(`['"\`](${prefixes.map((p) => p.replace(/-/g, '\\-')).join('|')}):([a-z0-9-]+)['"\`]`, 'g');

  return {
    name: 'offline-icons-plugin',

    getClientModules() {
      return [path.resolve(context.siteDir, 'src/clientModules/offlineIcons.ts')];
    },

    async loadContent() {
      const used = new Map(prefixes.map((prefix) => [prefix, new Set()]));

      for (const target of scan) {
        const absolute = path.resolve(context.siteDir, target);
        const files = path.extname(absolute) ? [absolute] : walk(absolute);
        for await (const file of files) {
          for (const [, prefix, name] of (await readFile(file, 'utf8')).matchAll(pattern)) {
            used.get(prefix).add(name);
          }
        }
      }

      const collections = [];
      for (const [prefix, names] of used) {
        if (!names.size) continue;

        const collection = require(`@iconify-json/${prefix}/icons.json`);
        const { icons, aliases, ...defaults } = collection;
        const subset = { ...defaults, prefix, icons: {}, aliases: {} };

        for (const name of [...names].sort()) {
          if (!copyIcon(collection, subset, name)) {
            console.warn(`[offline-icons-plugin] Unknown icon "${prefix}:${name}"; it will fall back to the Iconify API.`);
          }
        }
        collections.push(subset);
      }

      return collections;
    },

    async contentLoaded({ content, actions }) {
      // Written to .docusaurus/offline-icons-plugin/default/icons.json
      await actions.createData('icons.json', JSON.stringify(content));
    },
  };
}
