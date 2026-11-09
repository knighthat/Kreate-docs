---
sidebar_position: 5
slug: /usr/features/playback/loudness
title: Loudness
description: "Even out the volume between songs using YouTube's loudness, your server's ReplayGain or Kreate's analyzer."
---

Songs are mastered at very different volumes. **Even out loudness** makes quiet and loud songs play
at about the same volume.

Settings: **Settings → Player → Sound**.

| Setting | Default | What it does |
|---------|---------|--------------|
| **Even out loudness** | On | Adjusts each song's volume toward the target |
| **Target loudness** | −14 LUFS | The loudness songs are brought to |

Changes apply at once, to the song playing too.

## Where the loudness comes from

| Source | How Kreate knows a song's loudness |
|--------|-----------------------------------|
| **YouTube Music** | YouTube's own loudness value for the stream |
| **OpenSubsonic** | The server's **ReplayGain** tags |
| **Device** | Measured by the **Loudness analyzer** after a scan |

### ReplayGain reference

ReplayGain tags bring songs to a reference loudness, usually −18 LUFS. If your server's tags use a
different one, set it under **Settings → Network → Configure OpenSubsonic → ReplayGain reference**.

### Loudness analyzer

Turn it on under **Settings → General → Library → Loudness analyzer** (on by default). It measures
each local song once, in the background, and shows its progress in a notification.

Songs Kreate knows nothing about play unchanged.
