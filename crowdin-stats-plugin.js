/**
 * Fetches translation progress from the Crowdin API at build time (server side)
 * and exposes it as global data (`usePluginData('crowdin-stats-plugin')`).
 *
 * Environment variables (shared with crowdin-translators-plugin.js):
 *   CROWDIN_TOKEN       Personal access token with read access to the project
 *   CROWDIN_PROJECT_ID  Numeric project id
 *
 * The token never reaches the browser; only the aggregated numbers below do.
 * When either variable is missing or the request fails, `available` is false
 * and the site falls back to counts from .generated/translators.json.
 */
export default function CrowdinStatsPlugin() {
  return {
    name: 'crowdin-stats-plugin',
    async loadContent() {
      const token = process.env.CROWDIN_TOKEN;
      const projectId = process.env.CROWDIN_PROJECT_ID;
      const unavailable = { available: false, languages: null, progress: null, completed: null };

      if (!token || !projectId) {
        console.info('[crowdin-stats-plugin] CROWDIN_TOKEN / CROWDIN_PROJECT_ID not set, skipping Crowdin stats.');
        return unavailable;
      }

      try {
        const response = await fetch(
          `https://api.crowdin.com/api/v2/projects/${projectId}/languages/progress?limit=500`,
          { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15_000) },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const rows = (await response.json()).data.map(({ data }) => data);
        const totalWords = rows.reduce((sum, row) => sum + row.words.total, 0);
        const translatedWords = rows.reduce((sum, row) => sum + row.words.translated, 0);

        return {
          available: true,
          // Target languages set up in the project, including ones not started yet.
          languages: rows.length,
          // Share of all words translated across every language (word-weighted).
          progress: totalWords ? Math.round((translatedWords / totalWords) * 100) : 0,
          // Languages that are 100% translated.
          completed: rows.filter((row) => row.translationProgress === 100).length,
        };
      } catch (error) {
        console.warn(`[crowdin-stats-plugin] Couldn't fetch Crowdin stats: ${error.message}`);
        return unavailable;
      }
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
