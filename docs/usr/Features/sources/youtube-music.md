---
sidebar_position: 3
slug: /usr/features/sources/youtube-music
title: YouTube Music
description: "Use YouTube Music with or without an account: sign-in, sync, region, quality and login for playback."
---

YouTube Music works out of the box: search, play, browse artists, albums and playlists, and start
radios, all without an account.

Signing in brings **your** library along and makes suggestions yours.

Settings: **Settings → Network → Configure YouTube Music**.

## Signing in

1. Turn on **Use YouTube Music account**.
2. Tap **Sign in**. Google's sign-in page opens inside the app.
3. If the account has several channels, choose one. Tap the row later to **change channel**.

Tap the signed-in row to sign out. Signing out stops showing your YouTube Music library in Kreate;
songs you liked stay liked.

If YouTube ends the session, the row says so; tap it to sign in again.

:::note
When a [proxy](./proxy.md) is used, the sign-in page goes through it too. Some setups can't: a
device whose WebView can't use a proxy, or a SOCKS5 proxy with a username. The row tells you when
that's the case.
:::

## Sync

| Setting | Default | What it does |
|---------|---------|--------------|
| **Sync songs** | On | Your liked songs on YouTube Music mark the same songs liked in your library |
| **Sync albums** | On | Albums saved to your YouTube Music library show in the Albums tab |
| **Sync artists** | On | Artists you subscribed to show in the Artists tab |
| **Sync playlists** | On | Your playlists show in the Playlists tab |

While **Sync songs** is on, likes and dislikes go both ways: liking a song in Kreate likes it on
your account. Syncing only updates songs already in your library; it never adds new ones.

## What you can do while signed in

- **Bookmark** an album = save it to your YouTube Music library.
- **Follow** an artist = subscribe.
- **Add to library** a playlist.
- **Edit your own playlists**: reorder, remove songs, rename, change description and who can see
  it, delete. See [Playlists](../library/playlists.md).
- **Create playlists** on YouTube Music.

Signed out, bookmarks and follows on YouTube items are kept on the device instead.

## Region

**Region** chooses the country whose catalog YouTube answers from. Leave it on the default to
follow the device's region.

## Playback quality

Two sliders, **On Wi-Fi** (default High) and **On mobile data** (default Medium). While signed in,
the top step is **Original**: 256 kbps with YouTube Premium; accounts without Premium get High.

## Login for playback

Whether songs are fetched in your signed-in session:

| Choice | Meaning |
|--------|---------|
| **Never** | Don't use login for playback. |
| **On-failure** (default) | Retry with login if a song fails, for example an age-restricted one. |
| **Always** | Always use login for playback. |

It does nothing while you're signed out.

## Links

Kreate opens `music.youtube.com` links. See [Open with and links](../integrations/open-with-and-links.md).
