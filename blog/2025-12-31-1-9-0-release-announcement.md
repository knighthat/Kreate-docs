---
title: v1.9.0 Update Announcement
description: The last update
authors: [knighthat]
tags: [release]
---

<!-- truncate -->

> `The last update` of this year.

## What's changed

Quite a few things. We changed how the **back button** works inside the app.

First, when you disable `Close app on back`, the app won't make you
confirm your back, it just brings the app to the background and continues
its business as usual.

Secondly, if the option is turned on and you close the app, or when you
swipe up (or close) the app in task manager, **the player will stop**.

However, donwload process will not be closed in either scenario, because
it's supposed to run in the background regarldess.

This change makes the app's behavior more predictable and more compliant
with the development guidelines (except for the download).

## ⭐ What's new

As usual, when major version is introduced, there's new thing(s) added to
the app.

This time, we have 2 newly added features:

1. Multi-profile system
2. Shortcut to export database

### 👤 Mutli-profile system

> Developed by [yrrrad8](https://github.com/yrrrad8)

This new feature allows you to have multiple profiles in the same app.

Each profile has a separate database and settings, which makes them
completely independent from one another.

<!-- TODO: Add link to feature article -->

### 🚪 Shortcut to export database

> Developed by [dis-Is-Fine](https://github.com/dis-Is-Fine)

In the event of unrecoverable crash, you can safely export your database
from the shortcut menu (accessed by tap & hold the app's icon in your home screen).

### 🖼️ Button to change thumbnail

:::warning[Limited support]
Only available for songs and albums
:::

> Developed by [KnightHat](https://github.com/knighthat)

Accessible in their menus.

You can either paste a direct url to the image, or choose
a local image by selecting the `folder` icon.

:::danger[Persistent image required]
Kreate have yet supported storing your image(s) locally,
this process requires the image or the url to be persistent.

If the image is no longer existed externally, your image
won't show up.
:::

## 🐛 Fixes

### Mismatched download icon background

In previous versions, download button in local playlist had different
background color when the song is playing.

Though this is a small visual bug, we think it's nice to have everything
match, or at least expected.

### Crash report showed up on every startup

Similarly, having a crash report showing up at every startup
(even though the app didn't crash) is confusing for many people.

In this new release, the app will automatically and correctly
remove the report when you close the app.

### Player errored out when you play a song after closing the app

In some instnaces, the player failed to restart when the app
opens after closed (either expected or unexpected close).

Due to a small bug in the closing procedure, the player didn't
stop properly, which was the motive for us to rework the closing
procedure as mentioned in [What's changed](#whats-changed).

## ❌ Removals

There's one setting removed from this update.
It is "Stop player after swiping up in task manager".

Since the app is now properly closed after swipe up,
this setting becomes irrevalent.
