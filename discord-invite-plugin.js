/**
 * Fetches public info for a Discord invite at build time and exposes it as
 * global data (`usePluginData('discord-invite-plugin')`).
 *
 * Discord's API doesn't allow browser (CORS) requests, so this can't be done
 * client-side. Member counts are therefore a snapshot from the last build.
 * If the request fails, the build continues with `fallback` and no counts.
 */
export default function DiscordInvitePlugin(context, { code, fallback = {} }) {
  return {
    name: 'discord-invite-plugin',
    async loadContent() {
      const base = { code, url: `https://discord.gg/${code}`, ...fallback, icon: null, online: null, members: null };

      try {
        const response = await fetch(
          `https://discord.com/api/v10/invites/${code}?with_counts=true`,
          { signal: AbortSignal.timeout(10_000) },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const { guild, approximate_presence_count, approximate_member_count } = await response.json();
        return {
          ...base,
          name: guild.name ?? base.name,
          description: guild.description ?? base.description,
          icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128` : null,
          online: approximate_presence_count ?? null,
          members: approximate_member_count ?? null,
        };
      } catch (error) {
        console.warn(`[discord-invite-plugin] Couldn't fetch invite ${code}, using fallback: ${error.message}`);
        return base;
      }
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
