---
id: choosing-your-build
title: Choosing your build
slug: /usr/choosing-your-build
sidebar_position: 0
---

import Icon from '@components/Icon';
import FDroidLogo from '@components/Icon/FDroid';
import IzzyOnDroidLogo from '@components/Icon/IzzyOnDroid';
import ObtainiumLogo from '@components/Icon/Obtainium';
import OpenAPKLogo from '@components/Icon/OpenAPK';

Kreate is available on multiple platforms,
each platform has their own *pros* and *cons*.

## <Icon icon='mdi:github' /> GitHub

GitHub builds are the most up-to-date version, always.

Other platforms rely on new GitHub release to either compile,
or to delivery new version to end user - **you**.

Additionally, GitHub builds come with auto-update feature,
so you don't have to download a copy of Kreate everytime new release drops.
Which makes this version of Kreate most desireable.

| Pros | Cons |
| ---- | ---- |
| Most up-to-date | Require running app to check for update |
| Has auto-update | |

## <FDroidLogo width='32px' /> F-Droid

F-Droid is a well-known platform to donwload open-source app.

Kreate is also available on this platform, but it has its own flaws.
One of the *problems* with the platform is that they handle building
and delivering by themselves, and this process happens in cycles.

:::info[Build Process]

*"This build process is done daily, and applications are processed in batch.
As steps are done behind the scene and are mostly automatic;
all the submitter needs to do is to wait for it to finish."*

\- [Inclusion How-To](https://f-droid.org/docs/Inclusion_How-To/) | F-Droid

:::

As the result, FDroid builds are always behind (compared to GitHub builds).
This process can take anywhere from a few days to a week (or even more occasionally).

| Pros | Cons |
| ---- | ---- |
| Easy to install | Latecomer |
| Updated in the background | |

## <IzzyOnDroidLogo width='32px' /> IzzyOnDroid

This version of Kreate is the balance between GitHub and F-Droid builds.

It has the fast deliver time,
ranging from a few minutes to a couple of hours after GitHub.
And background update inherited from F-Droid

But it's not perfect! Izzy is an external repository,
it requires some knowledge to add it into F-Droid

| Pros | Cons |
| ---- | ---- |
| New version avaiable after short time | Harder to setup |
| Background update | |

## <ObtainiumLogo width='32px' /> Obtainium

:::info[Obtainium]
[Obtainium](https://obtainium.imranr.dev/) allows you to install
and update apps directly from their release pages,
and receive notifications when new releases are made available.
:::

Unlike other platforms. Obtainium doesn't actually
compile, store, or deliver any version of Kreate.\
But what it does is it notifies you
when new version of Kreate becomes available for download.

However, this version of Kreate is the same as GitHub build.
Meaning, auto-update is integrated by default.\
Therefore, this version only beneficial
if you want to be notified when new version drops.

| Pros | Cons |
| ---- | ---- |
| Perks of GitHub builds | Require 3rd party app |
| Notify when new version drops | Battery usage when check for new updates |

## <OpenAPKLogo width="32px" /> OpenAPK

OpenAPK is a web-based APK distributor. They don't actually have an official
Android app for you to install, instead, you donwload and install your desired
applications from the web (in APK format).

Installing Kreate from this platform isn't preferred. Its purpose is for discovery.

One major downside is that the app always deliver
[uncompressed version](/usr/faq/minified_and_full),
which costs you more bandwidth to download.

| Pros | Cons |
| ---- | ---- |
| Perks of GitHub builds | Use uncompressed build |
