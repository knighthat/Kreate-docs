---
sidebar_position: 2
slug: /usr/features/offline/storage
title: Storage and caches
description: "See how much room Kreate takes and set or clear the song cache, downloads and image cache."
---

**Settings → Data → Storage** shows how much room Kreate takes and lets you limit it.

At the top, a bar of the whole device: the app's parts (image cache, song cache, downloads, download
covers, lyrics) and other apps. Under it, a bar each for the three limits below. They update every
couple of seconds.

## Song cache

Streamed songs are kept to play again without loading them, shared by every profile.

- **Default**: 1 GiB.
- When full, the songs used least recently are removed first.
- **Off** streams songs without keeping them.

## Song downloads

The room [downloads](./downloads.md) may take. **Default**: 4 GiB. Nothing is deleted when you lower
it; new downloads are refused until there's room.

## Disk cache (images)

Covers and pictures kept on the device to load faster. **Default**: 128 MiB.

## Changing a size

Tap a bar to open a field in MiB and a slider of presets from **Off** to **Unlimited**.

If the new size is smaller than what's stored, Kreate asks first:

- **Song cache / image cache**: once the app restarts, what doesn't fit is removed, least recently
  used first. Off removes all of it.
- **Downloads**: nothing is deleted.

Cache sizes apply after a restart: use **Apply & restart**, or the restart button at the top of the
page.

## Clearing

Each bar has a button to empty it, after a confirmation:

| Bar | What's removed |
|-----|----------------|
| Image cache | Every image on the device; tick the box to clear images in memory too |
| Song cache | Every streamed song, for every profile; downloads stay |
| Downloads | Every profile's downloads; they can still be streamed |

:::note
These sizes are shared by every profile, so only the **default profile** can change or clear them.
:::

## Memory cache

**Settings → Data → Images → Memory cache**: the share of memory used to keep recently seen images
for even faster loading (default 15%).

## Binary units

Sizes show in binary units (MiB, GiB) by default. Turn off **Settings → UI → Layout → Binary units**
to see MB and GB.
