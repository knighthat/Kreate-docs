/**
 * Exposes the newest blog posts and release posts as global data so non-blog pages
 * (e.g. the homepage) can list them with `usePluginData('recent-posts-plugin')`.
 *
 * Releases live in a second blog instance (id `releases`, see docusaurus.config.ts).
 */
const BLOG = 'docusaurus-plugin-content-blog';

export default function RecentPostsPlugin(context, { limit = 10 } = {}) {
  // Both instances already sort their posts newest first.
  const latest = (instance) =>
    (instance?.blogPosts ?? [])
      .slice(0, limit)
      .map(({ metadata }) => ({
        title: metadata.title,
        permalink: metadata.permalink,
        date: new Date(metadata.date).toISOString(),
        description: metadata.description ?? '',
        image: metadata.frontMatter.image ?? null,
        readingTime: metadata.readingTime ?? null,
      }));

  return {
    name: 'recent-posts-plugin',
    async allContentLoaded({ allContent, actions }) {
      const blogs = allContent[BLOG] ?? {};
      actions.setGlobalData({
        posts: latest(blogs.default),
        releases: latest(blogs.releases),
      });
    },
  };
}
