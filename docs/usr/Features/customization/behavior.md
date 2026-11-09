---
sidebar_position: 2
slug: /usr/features/customization/behavior
title: General behavior
description: "Library scanning, back-button behavior, page buttons and the restart button."
---

**Settings → General**: how the app behaves.

## Library

| Setting | Default | What it does |
|---------|---------|--------------|
| **Scan local media** | On | Look for music files on this device |
| **Loudness analyzer** | On | Measure how loud local songs are to even out the volume |
| **Scan interval** | 30 min | How often new local media is searched for |

See [Music on your device](../sources/local-files.md).

## Navigation

| Setting | Default | What it does |
|---------|---------|--------------|
| **Exit on back** | On | Going back from the first screen closes the app; off keeps it open |
| **Confirm exit** | 2 s | Press back twice within this time to leave; *No confirmation* to leave at once |
| **Open player from notification** | On | Tapping the media notification opens the full player |

## Page buttons

| Section | Setting | Default | Choices |
|---------|---------|---------|---------|
| Albums | **Page button** | Play | Play · Shuffle · Play next · Add to queue |
| Artists | **Page button** | Play | the same |
| Playlists | **First button** | Play | Play · Shuffle · Play next · Add to queue · Share |
| Playlists | **Second button** | Shuffle | the same |

The album and artist page button sits before ⋮ in the top bar; the playlist buttons sit under the
playlist's header. The two playlist buttons are never the same.

## Picture in picture

See [Picture in picture](../playback/picture-in-picture.md).

## Logging

See [Logs and crash reports](../reference/logs-and-crashes.md).

## Restart button

Some settings apply only after a restart (network timeouts, cache sizes). When one changed, a
**restart** button lights up in the settings pages' top bar. It asks first; playback stops and the
app opens again.
