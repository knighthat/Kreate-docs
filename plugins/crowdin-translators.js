import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Builds .generated/translators.json (gitignored) from Crowdin's "top members"
 * report at build time, before the pages that import it are bundled.
 *
 * Environment variables (shared with crowdin-stats.js):
 *   CROWDIN_TOKEN       Personal access token with access to the project's reports
 *   CROWDIN_PROJECT_ID  Numeric project id
 *   PROJECT_OWNER_ID    Optional. Crowdin user id left out of the list; defaults to
 *                       the project owner reported by the API.
 *
 * When a variable is missing or any request fails, the committed
 * src/pages/translators/translators.json is copied there instead, so the import
 * always resolves. The output is only rewritten when its content changes.
 */
const API = 'https://api.crowdin.com/api/v2';
const TAG = '[crowdin-translators-plugin]';
const POLL_INTERVAL_MS = 2_000;
const POLL_ATTEMPTS = 30;

// Docusaurus loads plugins once per locale; fetch the report only once per process.
let pending = null;

async function api(endpoint, token, init = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`${init.method ?? 'GET'} ${endpoint}: HTTP ${response.status}`);
  return (await response.json()).data;
}

async function fetchTranslators(token, projectId, ownerId) {
  const project = `/projects/${projectId}`;

  ownerId ??= (await api(project, token)).userId;

  const { identifier } = await api(`${project}/reports`, token, {
    method: 'POST',
    body: JSON.stringify({ name: 'top-members', schema: { unit: 'words', format: 'json' } }),
  });

  for (let attempt = 0; ; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    const { status } = await api(`${project}/reports/${identifier}`, token);
    if (status === 'finished') break;
    if (status === 'failed' || status === 'canceled') throw new Error(`report ${status}`);
    if (attempt + 1 >= POLL_ATTEMPTS) throw new Error('report took too long to generate');
  }

  // The download link is pre-signed, so it must not carry the API token.
  const { url } = await api(`${project}/reports/${identifier}/download`, token);
  const report = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!report.ok) throw new Error(`report download: HTTP ${report.status}`);

  return (await report.json()).data
    .filter(({ user, translated }) => String(user.id) !== String(ownerId) && translated > 0)
    .map(({ user, languages, translated }) => ({
      user: { name: user.fullName, avatar: user.avatarUrl, joined: user.joined },
      languages: languages.map(({ id, name }) => ({ id, name })),
      translated,
    }));
}

async function writeIfChanged(file, content) {
  const current = await fs.readFile(file, 'utf8').catch(() => null);
  if (content === current) return false;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
  return true;
}

async function useFallback(fallback, output) {
  await writeIfChanged(output, await fs.readFile(fallback, 'utf8'));
}

async function updateTranslatorsFile(fallback, output) {
  const token = process.env.CROWDIN_TOKEN;
  const projectId = process.env.CROWDIN_PROJECT_ID;

  if (!token || !projectId) {
    console.info(`${TAG} CROWDIN_TOKEN / CROWDIN_PROJECT_ID not set, using the committed translators.json.`);
    return useFallback(fallback, output);
  }

  try {
    const translators = await fetchTranslators(token, projectId, process.env.PROJECT_OWNER_ID || undefined);
    if (!translators.length) throw new Error('report returned no translators');

    const changed = await writeIfChanged(output, JSON.stringify(translators));
    console.info(`${TAG} ${changed ? 'Updated' : 'Up to date:'} translators.json (${translators.length} translators).`);
  } catch (error) {
    console.warn(`${TAG} Couldn't fetch translators, using the committed translators.json: ${error.message}`);
    await useFallback(fallback, output);
  }
}

export default function CrowdinTranslatorsPlugin(context) {
  const fallback = path.join(context.siteDir, 'src/pages/translators/translators.json');
  const output = path.join(context.siteDir, '.generated/translators.json');

  return {
    name: 'crowdin-translators-plugin',
    async loadContent() {
      pending ??= updateTranslatorsFile(fallback, output);
      await pending;
    },
  };
}
