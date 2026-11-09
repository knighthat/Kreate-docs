---
sidebar_position: 1
slug: /usr/features/integrations/android-auto
title: Android Auto
description: "Browse your library in the car and play music by voice with Android Auto."
---

Kreate works in Android Auto: browse your library on the car's screen, control playback and ask
for music by voice.

## Browsing

Auto shows the same four tabs as the app, **Songs**, **Albums**, **Artists** and **Playlists**,
with the same items and the same source filters you set on the home tabs. Albums and artists show
as grids.

Song rows show *artists • album*.

### What a tap does

**Settings → Player → Android Auto**:

| Setting | Default | Choices |
|---------|---------|---------|
| **Tapping an album** | Show its songs | Show its songs · Play from the start · Play in random order |
| **Tapping an artist** | Show its songs | the same |
| **Tapping a playlist** | Show its songs | the same |

Tapping a song in the Songs tab plays it with the songs below it, or with a radio when
**Radio from Songs** is on.

Disliked songs are left out.

## Voice search

Say *"Play … on Kreate"* to the Assistant. Kreate searches its sources in order and plays the first
match:

- a **song** plays with a radio of songs like it;
- an **album**, **artist** or **playlist** plays all its songs.

When names tie, songs win over artists, artists over albums, albums over playlists. Naming the
artist ("play X by Y") helps.

*"Play music on Kreate"* without a name resumes the queue, or plays a song you like.

### Search order

**Settings → Player → Android Auto → Voice search**: drag the sources to change the order
(default **Device → OpenSubsonic → YouTube Music**) and switch one off to skip it. OpenSubsonic is
dimmed while its source is off.

Voice search also works on the phone, through the Assistant.

## Covers

Covers in Auto, on the lock screen and in the notification are served by Kreate itself, so device
and server covers show too.
