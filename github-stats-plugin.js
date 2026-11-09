/**
 * Fetches star and fork counts of a GitHub repository at build time and exposes
 * them as global data (`usePluginData('github-stats-plugin')`).
 *
 * Unauthenticated requests are limited to 60/hour per IP; set GITHUB_TOKEN to
 * raise that limit. If the request fails, the build continues with null counts.
 */
export default function GithubStatsPlugin(context, { repo }) {
  return {
    name: 'github-stats-plugin',
    async loadContent() {
      const base = { repo, url: `https://github.com/${repo}`, stars: null, forks: null };
      const headers = { Accept: 'application/vnd.github+json' };
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
          headers,
          signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const { stargazers_count, forks_count } = await response.json();
        return { ...base, stars: stargazers_count ?? null, forks: forks_count ?? null };
      } catch (error) {
        console.warn(`[github-stats-plugin] Couldn't fetch ${repo}: ${error.message}`);
        return base;
      }
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
