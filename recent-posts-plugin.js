/**
 * Exposes the newest blog posts as global data so non-blog pages
 * (e.g. the homepage) can list them with `usePluginData('recent-posts-plugin')`.
 */
export default function RecentPostsPlugin(context, { limit = 6 } = {}) {
  return {
    name: 'recent-posts-plugin',
    async allContentLoaded({ allContent, actions }) {
      const blog = allContent['docusaurus-plugin-content-blog']?.default;
      // Blog posts are already sorted newest first.
      const posts = (blog?.blogPosts ?? [])
        .slice(0, limit)
        .map(({ metadata }) => ({
          title: metadata.title,
          permalink: metadata.permalink,
          date: new Date(metadata.date).toISOString(),
          description: metadata.description ?? '',
          image: metadata.frontMatter.image ?? null,
          readingTime: metadata.readingTime ?? null,
        }));

      actions.setGlobalData({ posts });
    },
  };
}
