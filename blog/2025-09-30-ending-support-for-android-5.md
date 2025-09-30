---
title: Ending support for Android 5 and 5.1
description: It's inevitable
authors: [knighthat]
tags: [news]
---

> The time has come! Can't keep supporting an out-dated version forever, I guess.

<!-- truncate -->

Recently, one of the major depdency of Kreate - Room, has [pulled support for **Android Lollipop**](https://developer.android.com/jetpack/androidx/releases/room#2.8.0). 
This means cutting off support for Android 5 (sdk 21) and Android 5.1 (sdk 22) altogether.

This is nothing to be surprised about. **Android Lollipop** was released about _10 years ago_, 
its support had been officially ended on _March 2018_.

Kreate relies heavily on internet connection, but using it without the most up-to-date
security patch is extremely dangerous, not only to your phone, but it can also be used 
as open door to attack other devices on the same network.

## Room

This library is one of the most important library that used by Kreate.

For details, please read [this article](https://developer.android.com/jetpack/androidx/releases/room) 
from Google.

In short, this library controls data stored in your device. Not the song
that you've downloaded, but the information related to the song (i.e. title, artists, duration, etc.)

Since this library plays such important role in Kreate, keeping it up-to-date is most prioritized.

## But wait! There's more

> You thought that was it? Continue reading

[Room](https://developer.android.com/jetpack/androidx/releases/room) isn't the only thing on the list.
As a part of [androidx namespace](https://developer.android.com/jetpack/androidx/), this change might not
be the first, but will be the presedence for other libraries to follow.

At the time of writing, other libraries, such as material3 has begun to require Android 6+ in the
alpha release - [1.5.0-alpha02](https://android.googlesource.com/platform/frameworks/support/+/c70dba60d145360a1efffe19f63ea36dfbab9455).

## How will this affect you?

**Most likely nothing!**

According to Composables' [Android distribution chart](https://composables.com/android-distribution-chart), only 
*_0.6%_* of the total Android users are using **Android Lollipop**. That's right, *just shy over half of a percent*, that means for every ~167 people, 
there's only 1 of them uses Android of this version.

## When will this happen to Kreate?

At the time of writing, **Android Lollipop**'s support is set to be stopped on version 2.0.

That means, with the release of 2.0 (and subsequent releases), 
you'll need a device running Android 6 (Marshmallow) or higher in order to install/update.

:::info
For those who are using **Android Lollipop**, You don't have to worry about
Kreate going dark on you. 

This just means that after the release of 2.0, any problem you face 
will not be resolved, any issue ticket opened by you will be automatically
closed without further discussion.
:::