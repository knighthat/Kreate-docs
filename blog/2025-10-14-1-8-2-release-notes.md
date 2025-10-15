---
title: v1.8.2
description: Fixes, changes, and some removals
authors: [knighthat]
tags: [release]
image: https://i.ibb.co/kNNzGNj/v1-8-2.png
---

Some changes are definitely controversial, but it is what it is

<!-- truncate -->

Let's go over the release note

### Fixes

```diff
- Square icon in multiple places
- Icons with dark background on older devices
- Inverted icon's background when using monochrome icons
- Adaptive icon background (teardrop, squircle, square, etc.)
- White boxes in search lyrics text fields
- Like button in AA and media controller
- Crash when synced artists/albums exist along with locals - #785
- Crash when exit app while downloading song(s)
- Fail to restore settings - #726
- Crash when start unselected song
```

### Changes

```diff
+ Higher resolution thumbnail's placeholder
+ Move runtime logs and crash logs to external location
+ Remove song's cache will attempt to remove cached stream url
+ Prevent crash when buffer goes out of range
+ Stop querying for stream url when network is unavailable
+ Improve queue shuffle
```

### Removes

```diff
- Albums, artists, playlists shortcuts
```

## Icons

> There are quite a few changes on icons in this version.

As I'm getting more experienced with how icons work in Android,
it's time to make it more pleased to look at.

Main change in this version is that the app's icon is now looks
better on your theme.

### Regular icons

![App icon colored 1](/img/blog/app_icon_colored_1.webp)
![App icon colored 2](/img/blog/app_icon_colored_2.webp)
![App icon colored 3](/img/blog/app_icon_colored_3.webp)
![App icon colored 4](/img/blog/app_icon_colored_4.webp)
![App icon colored 5](/img/blog/app_icon_colored_5.webp)

### Monochrome mode

![App icon monochrome 1](/img/blog/app_icon_monochrome_1.webp)
![App icon monochrome 2](/img/blog/app_icon_monochrome_2.webp)
![App icon monochrome 3](/img/blog/app_icon_monochrome_3.webp)
![App icon monochrome 4](/img/blog/app_icon_monochrome_4.webp)
![App icon monochrome 5](/img/blog/app_icon_monochrome_5.webp)

> Additionally, some fixes to misplaced icons are applied too.
> For example, square icon was mistakenly placed in the player instead of the circle one

## Like button malfunction

> Reported in [#454](https://github.com/knighthat/Kreate/issues/454) and [#604](https://github.com/knighthat/Kreate/issues/604)

It's completely fixed, the button is now tap-to-rotate.

## Constant crash after you close the app

This is pretty annoying, since the crash happens before the crash log has the chance to even present itself.
You have no idea why it crashed.

After an investigation, I found out that when you download a song, or multiple songs at once,
and you exit the app (either by accident or the app got shutdown), Kreate will attempt to restart
the download. But because the component that handles the download was closed with the app, 
it's now missing, so the app can't restart the download, thus, crash the app on startup.

## Fail to restore settings

> Reported in [#726](https://github.com/knighthat/Kreate/issues/726)

This bug was introduced a couple versions back due to a call to a
function was removed during a "rework"

## New location for logs

From now on, you can always find runtime logs (must be enabled in Settings) in this location

```
Android/data/me.knighthat.kreate/cache/logs
```

> In order for the logs to start generating, you must enable Runtime log in app's Settings > Misc

And crash logs are stored in

```
Android/data/me.knighthat.kreate/files/crashlogs
```

This will allows users to access the logs without having to open the app, so when catastrophic
failure happens, users can still obtain the logs and submit it.

Secondly, I've received many reports that crash logs don't delete itself after the app is closed.
After some research, I can confirm it's true.

Some versions of Android don't close the app in using traditional ways, but either shut the app off,
or use a custom implementation.

However, crash reports in Kreate are designed to survive sudden close. Meaning, unless the app exits
gracefully, the report stays untouched.

To combat this, a new way of handling logs is on the way, however, this process is still incupating, thus,
it's not included in this version. So, if you experience persistent crash report, just go to 1 of the locations
above and delete it manually.

# Removal of artists, albums, and playlists shortcuts

Due to some conflicts with `copy crash log` shortcut, these shortcuts are removed in recent version.

But, I'll make up for this in the future releases