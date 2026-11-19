---
sidebar_position: 7
slug: /docs/features/playback/playback-settings
title: Playback settings
description: "Queue, buffering, failure handling, sleep timer and history settings of the player."
---

**Settings → Player** decides how songs play and what's kept of them.

## Queue

| Setting | Default | What it does |
|---------|---------|--------------|
| **Radio from Songs** | Off | On: a song tapped in the Songs tab plays with songs like it. Off: it plays with the songs below it. |
| **Radio from search** | Off | The same for songs tapped in search |
| **Keep the queue** | On | Pick up where you left off after the app closes |
| **Save interval** | 10 s | How often the position is saved while a song plays |
| **Load the next song ahead** | 5 s | Loads the first seconds of the next song early, for a quicker start. Off: only load the next song when it starts. |
| **When a song fails** | Try again, then skip | See below |
| **Give up loading after** | 15 s | How long a song may load without progress before it counts as failed. Off: wait until the network times out. |

### Keep the queue

The queue is saved as it changes, and the position of the playing song when you pause, seek or
change songs, and every **Save interval** while playing. When the app starts again the queue is
back, ready to play. Turning it off stops saving; the last saved queue stays.

### When a song fails

| Choice | What happens |
|--------|--------------|
| **Skip to the next song** | Goes on with the next one |
| **Try again, then skip** (default) | Retries once, then skips |
| **Try again, then stop** | Retries once, then stops |
| **Stop** | Stops |

Kreate skips at most three songs in a row before stopping, and tells you why a song failed.

#### Replaced YouTube Music songs

YouTube sometimes takes a song down and publishes it again under a new address, so the old one
stops playing. With a choice that tries again, Kreate checks such a song first:

- if it plays after all, it's tried again;
- if YouTube has a new upload of it (same length within 2 seconds, matching title), the new one
  takes its place in the queue and plays. What your library keeps of the old song (likes,
  places in playlists) moves over to it. A downloaded song is left as it is;
- if there's none, it skips or stops as the setting says.

## Sound

**Even out loudness** and **Target loudness**: see [Loudness](./loudness.md).

## Buffering

| Setting | Default | What it does |
|---------|---------|--------------|
| **Load ahead** | 50 s | How much of the song is loaded ahead of where it plays. *Unlimited* loads as much as memory allows. |
| **Load before playing** | 1 s | How much must be loaded before a song starts or goes on after a seek |
| **Keep what was played** | Off | Seeking back up to a minute doesn't load it again |

*Keep what was played* applies when the player is made again: the page's **restart** button
restarts the player and goes on where it was.

## Sleep timer

See [Sleep timer](./sleep-timer.md).

## History

| Setting | Default | What it does |
|---------|---------|--------------|
| **Pause history** | Off | What you listen to isn't recorded |
| **Minimum play time** | 1 s | Songs played for less aren't added to the history. Pauses and loading don't count. |

## Lyrics

See [Lyrics](./lyrics.md#settings).

## Android Auto

See [Android Auto](../integrations/android-auto.md).
