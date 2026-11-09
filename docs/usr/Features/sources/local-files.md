---
sidebar_position: 2
slug: /usr/features/sources/local-files
title: Music on your device
description: "Scan the music files on your phone, measure their loudness and reorder device albums."
---

Kreate finds the audio files on your phone and adds them to your library as **device** songs,
albums and artists.

## Turning it on

1. Allow the **Music** permission (in the setup wizard, or by tapping the setting).
2. Open **Settings → General → Library** and turn on **Scan local media** (on by default).

## Settings

| Setting | Default | What it does |
|---------|---------|--------------|
| **Scan local media** | On | Looks for music files on this device. |
| **Loudness analyzer** | On | Measures how loud each local song is, so [Even out loudness](../playback/loudness.md) works for them too. |
| **Scan interval** | 30 minutes | How often Kreate looks for new local media in the background. |

Scans also run when the app starts. A scan shows a notification while it runs ("N songs
scanned"); the loudness analyzer shows its own progress, and lists the songs it couldn't analyze.

:::tip
The loudness analyzer decodes each whole file once, in the background at low priority. With a big
collection the first run takes a while; later runs only measure new songs.
:::

## Covers

Album art comes from the files and MediaStore. Covers are kept in the image cache in two sizes so
lists scroll smoothly.

## Device albums

A device album can be **reordered**: open its ⋮ menu, turn on **Reorder**, then drag the handles
where track numbers were. Long press **Reorder** to reset to the album's own order.

## Limits

- Device songs can't be shared (there's no link).
- Lyrics embedded in files, or `.lrc` files next to them, aren't read yet; lyrics come from the
  [online lyrics sources](../playback/lyrics.md).
