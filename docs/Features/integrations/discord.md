---
sidebar_position: 3
slug: /docs/features/integrations/discord
title: Discord
description: "Show what you play and browse on your Discord profile."
---

Kreate can show what you're listening to on your Discord profile, with the cover, the artist and
how far into the song you are.

:::note
Discord isn't in the **FOSS** build. Its row says *Not available in FOSS build*. See
[Choosing your build](../../Installation/choosing-your-build.md).
:::

## Signing in

**Settings → Network → Integrations → Configure Discord**, then tap the sign-in row. Discord's own
page opens in your browser; approve Kreate there and you're sent back to the app. Kreate only gets
permission to set your status, nothing else.

Tap the account row again to sign out. Each [profile](../account/profiles.md) signs in on its own.

## What shows

| You're… | Your profile shows |
|---------|--------------------|
| **Playing a song** | Title, artists, the cover with the artist's picture in its corner, and a progress bar |
| **Paused** | The song, with *Paused* and no progress bar |
| **On an album, artist or playlist page** | Its name, its artists or owner, and *Viewing an album / artist / playlist* |
| **Looking at search results** | *Searching* and what you searched for |

A song playing or paused always wins over the page you're on. Anything else (the home tabs,
settings, the app in the background with nothing playing) clears your status.

Items from YouTube Music get a **Play on YouTube Music** or **View on YouTube Music** button, so
friends can open them. Every status also has a **Get Kreate** button.

:::tip
Discord never lets you click the buttons on your own status. Friends can.
:::

The texts on your status are in English, whatever the app's language.

## Settings

| Setting | Default | What it does |
|---------|---------|--------------|
| **Show activity on Discord** | On | Main switch. Off: nothing shows, even while signed in. |
| **YouTube Music** | On | Its songs, albums, artists, playlists and searches |
| **OpenSubsonic** | On | Its songs and searches |
| **On device** | On | Its songs and searches |

A song from a switched-off source shows nothing at all.

### Uploaded covers

Discord can only show pictures it can reach on the internet. YouTube Music covers are public, so
they're shown as they are. Covers of device songs and of your OpenSubsonic server aren't, so
Kreate uploads them to a public image host, where they're deleted after an hour.

| Setting | Default | What it does |
|---------|---------|--------------|
| **Largest cover** | 1024 px | Covers are scaled down to this before uploading |
| **On Wi-Fi** / **On mobile data** | 512 KiB | Largest upload; a bigger cover is shrunk to fit |

A cover already uploaded is reused while it's still online, however many songs share it. Until a
cover is ready, the Kreate logo shows in its place.

Turn **OpenSubsonic** and **On device** off if you don't want those covers uploaded.
