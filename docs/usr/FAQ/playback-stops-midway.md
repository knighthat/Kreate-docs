---
id: playback-stops-midway
title: Playback stops midway
slug: /usr/faq/playback-stops-midway
---

<div class="callout">
  Are you experiencing interruption during playback?
</div>

This is a fairly common issue when you stream a song that isn't on your device yet,
or when you first play the song after the download.

## 📍 Determining the source of problem

There are several factors that leads to this annoying problem. However, not all of
them are bugs, some of them aren't even Kreate's fault.

### YouTube's block

This is the most common "**issue**", and the most annoying one to experience.

Unlike most people think, when YT blocks, they don't just say `you are blocked`.

Here are some messages they send when you attempt to get the stream when blocked:

- Login required
- Login to confirm you're not a bot
- [Media] Not available
- Media can't be played
- [Media] Unavailable

Recently, new blocking methods have been implemented. One of them is cutting of
playback stream midway.

This is very easy to get while you're watching YT with an Adblock on.
The video/song stops somewhere in the middle with a popup "*Experiencing interruption? Find out why.*"
message in the corner of the screen.

:::danger[Dev message]
This is not Kreate's fault, we can't control when or where the block happens.
Workarounds are in development stage, so it'll be awhile before you can see one.
:::

### Corrupted cache

When a song isn't retrieved correctly, you won't be able to stream it back.

Since there's no official way to verify integrity of a song when it's cached or downloaded,
the only possible way is to listen to it.

The symptom is very easy to spot, a song stops at the exact same timestamp
on every playback.

### Kreate's problem

<div class="callout">
  Don't think it's YT blocking you? Try these troubleshooting steps.
</div>

The easiest method you can do is to play a song exists on your device.
This can be either a cached/downloaded song, or a song that's physically on your device.

:::tip
Songs that are existed on your device physically are more preferable in this case,
because we can eliminate corrupted cache situation.
:::

:::tip[On device songs]
Your songs must be put inside `Music` folder in order for Kreate
to read and perform playback. Only required on Android 13+.
:::

If you're able to listen to known-good songs without hiccups, chances are,
Kreate is not the problem

## 💡 Solutions

When you're [blocked by YouTube](#youtubes-block), the only thing you can do is to
wait for the block to pass. Don't worry, it's soft block.\
You can completely restart the app to force new session.

If a particular song [stops at the exact timestamp](#corrupted-cache) every time you attempt to play it.
Then the only solution is to remove all cache of the song and play it from start again.\
You can read our [Song reset](/usr/features/song-reset) article for details.

Lastly, if it's Kreate's fault, you can [open new issue ticket](https://github.com/knighthat/Kreate/issues) on our GitHub page.
**_Don't forget to check if somebody has already opened another ticket that's similar to you first_**

