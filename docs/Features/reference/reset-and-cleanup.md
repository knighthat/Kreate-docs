---
sidebar_position: 1.5
slug: /docs/features/reference/reset-and-cleanup
title: Reset and clean up
description: "Reset a profile's settings, clear search and listening history, and clean unused data out of the library."
---

Every action here asks first.

## Reset to default

**Settings → Reset to default** (the last row of the settings list) puts the active
[profile](../account/profiles.md)'s settings back to how they came:

- every setting of the profile, including its language and fonts;
- it's **signed out** of every account and server: YouTube Music, OpenSubsonic, Discord.

What stays: your library, history and playlists, other profiles, and storage sizes and logging
settings, which belong to the whole device.

Some settings take effect only after the app restarts.

## Database

**Settings → Data → Database**:

| Row | What it does |
|-----|--------------|
| **Clear search history** | Forgets every search this profile made |
| **Clear listening history** | Takes every play of this profile out of its [history](../account/history.md); its [statistics](../account/statistics.md) start over. The message after it has **Undo**. |
| **Clean up database** | Removes what nothing uses, see below |

### Clean up database

Your library keeps songs, albums and artists you only browsed past, for instance through a radio.
Cleaning up removes, **for every profile**:

- songs never played, never changed (liked, disliked, edited…) and in none of your playlists or
  the saved queue; songs with [lyrics from a file](../playback/lyrics.md#lyrics-from-a-file) stay;
- albums and artists you never bookmarked, followed or edited;
- playlists without songs.

Songs, albums and artists on the device always stay; the next scan would bring them back anyway.
Afterwards Kreate compacts the database, so it takes less room. If there's nothing to remove, it
says *Nothing to clean up*.

:::note
Clean up covers every profile, so only the **default profile** can run it. Other profiles show the
row grayed out.
:::
