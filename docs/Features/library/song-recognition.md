---
sidebar_position: 9
slug: /docs/features/library/song-recognition
title: Song recognition
description: "Hold the Songs tab to find out what's playing around you, then play it."
---

Hear a song you don't know? Kreate can listen to it and tell you what it is, using
[Shazam](https://www.shazam.com).

:::note
Song recognition isn't in the **FOSS** build. See
[Choosing your build](../../Installation/choosing-your-build.md).
:::

## Listening

**Hold the Songs tab** in the bottom bar. The phone buzzes and a ring appears above the tab, filling
up as Kreate listens:

| Ring | Time held | |
|------|-----------|---|
| Red | under 8 s | Too short; letting go does nothing but tell you so |
| Yellow | 8–12 s | Enough for most songs |
| Green | 12–16 s | Best chance of a match |

Let go to look the song up. At 16 seconds Kreate stops listening by itself.

The first time, Kreate asks for the microphone. If Android no longer asks because you refused
before, holding the tab opens the app's system settings so you can allow it there.

You can also open **Recognize song** from the Songs tab's sheet: it shows a big button to hold in
the same way.

## The result

While the song is looked up, a dialog says *Identifying the song…*.

**Found** shows the cover, title, artists and an explicit badge when it applies, with:

| Button | What it does |
|--------|--------------|
| **Play** | Searches YouTube Music and plays the first song found, like a song tapped in search |
| **Show matches** | Opens the YouTube Music search results, to pick the right version yourself |
| **View on Shazam** | Opens the song on Shazam's site |
| **Retry** | Listen again |
| **Close** | |

**No match** or **Couldn't look up the song** offer **Retry** and **Close**. Try again closer to the
music.

## Settings

**Settings → Network → Integrations → Recognize songs with Shazam** (on by default). Off: holding
the Songs tab does nothing and the sheet's entry is grayed out.

## Privacy

Only the sound recorded while you hold is sent to Shazam, together with the app's language and
your time zone. Your location isn't sent. Silence is never sent.
