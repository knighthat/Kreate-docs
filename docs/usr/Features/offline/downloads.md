---
sidebar_position: 1
slug: /usr/features/offline/downloads
title: Downloads
description: "Download songs for offline listening, follow progress in notifications and manage the download queue."
---

Download YouTube Music and server songs to listen without a connection. Downloads are kept until you
delete them, separate from the [song cache](./storage.md#song-cache).

## Downloading

- A song: **Download** in its menu.
- A cached song: tap **Cached** in its menu and move it to your downloads. If the cached copy is
  worse than the download quality set now, the song is downloaded again in the better quality.

Downloads use the stream quality of the song's source for the current network.

Downloaded songs show a **downloaded** badge, cached ones a **cached** badge.

## Notifications

Downloads show in notifications, grouped as downloading, downloaded and failed:

| Group | Buttons |
|-------|---------|
| Downloading | **Pause**, **Cancel** (**Resume** once paused) |
| Downloaded | **Play**, **Next**, **Queue** |
| Failed | **Retry** |

A download waiting for Wi-Fi or for the battery says so.

## The Downloaded page

**Account → Downloaded**:

- A **storage bar** with this profile's downloads, every profile's downloads and the size limit.
- **In progress**: the running download and the next in line; **See more** opens the
  [download queue](#the-download-queue).
- Every downloaded song with its size and quality, newest first (the button in the bar flips it).
- Source chips filter by source.
- Tap a song to play the list from it.

The sheet has **Play all**, **Shuffle**, **Play next**, **Add to queue**, **Delete all** (only what's
shown when filtered; asks first) and **Show disliked**.

## The download queue

Every unfinished download in the order asked for, failed ones last. Each cover shows the state:
progress ring with percent, hourglass (waiting), pause, or warning. Above the title: bytes of total,
*Next in line*, *Paused at 40%*, or why it failed.

Tap a download to pause, resume or retry it; **Cancel** at the end of the row stops it.

## Settings

**Settings → Data → Downloads**:

| Setting | Default | What it does |
|---------|---------|--------------|
| **Downloads at once** | 2 | The others wait |
| **Download retries** | 5 | A failing download is tried this many more times before it fails |
| **Only download on Wi-Fi** | Off | Downloads wait for an unmetered network |
| **Download on low battery** | On | Off: all downloads pause while the battery is low |
| **Download lyrics** | Off | Keeps a song's lyrics from your lyrics source once it's fully downloaded |

The space downloads may take is set under [Storage](./storage.md#song-downloads).

## Profiles

Each profile has its own downloads. A song downloaded by two profiles is stored once; deleting it
from one profile keeps the file for the other.

## Covers

A downloaded song's cover is saved with it, so it shows offline too.
