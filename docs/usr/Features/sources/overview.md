---
sidebar_position: 1
slug: /usr/features/sources/overview
title: How sources work
description: "How device files, YouTube Music and OpenSubsonic share one library, what gets stored and stream quality."
---

Kreate has three sources:

| Source | Needs | What it brings |
|--------|-------|----------------|
| [Device](./local-files.md) | Music permission | Audio files on the phone |
| [YouTube Music](./youtube-music.md) | Nothing; signing in is optional | The YouTube Music catalog; with an account, your library |
| [OpenSubsonic](./opensubsonic.md) | A server address and a sign-in | The music on your own server |

## One library

Everything you keep, from any source, lands in the same library. A song from YouTube Music and a
song from your server can sit in the same playlist, the same queue and the same statistics.

Every item shows a **source badge**, and most lists have **source chips** to show only some
sources.

## What gets stored

Kreate stores what you use, not whole catalogs:

- a song you **play**, **like**, **dislike**, **download** or **add to a playlist** is stored;
- an album you **bookmark** or an artist you **follow** is stored;
- **browsing** a source (search results, an artist page) stores nothing.

Syncing liked songs updates the songs already in your library (liked or not); it never adds new
ones. Your albums, artists and playlists on an account are shown **live** in the home tabs, after
the stored ones. Signing out or turning sync off stops syncing; it never clears what was synced.

## Live items

The Albums, Artists and Playlists tabs can also show items **live** from your accounts, after the
stored ones. **Pull down** on a home tab to fetch them again; pulling the Songs tab syncs your
liked songs from both accounts right away.

## Stream quality

Each streaming source has its own quality, separately **On Wi-Fi** and **On mobile data**:

| Step | YouTube Music | OpenSubsonic |
|------|---------------|--------------|
| Low | about 48 kbps | up to 64 kbps |
| Medium | about 128 kbps | up to 128 kbps |
| High | about 160 kbps | up to 320 kbps, lossless songs are converted |
| Original | 256 kbps with Premium, else High | the file as it is |

Device songs always play as they are.

## Turning a source off

- **YouTube Music** works without an account. Turning **Use YouTube Music account** off stops
  syncing your library.
- **OpenSubsonic** isn't contacted at all while its switch is off.
- **Device** scanning is switched under **Settings → General → Library**.
