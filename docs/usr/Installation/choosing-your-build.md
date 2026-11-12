---
id: choosing-your-build
title: Choosing your build
description: "The three Kreate builds (FOSS, GitHub and Patreon), what each one includes and where to get it."
slug: /usr/choosing-your-build
sidebar_position: 0
---

import Icon from '@components/Icon';
import FDroidLogo from '@components/Icon/FDroid';
import IzzyOnDroidLogo from '@components/Icon/IzzyOnDroid';
import ObtainiumLogo from '@components/Icon/Obtainium';
import OpenAPKLogo from '@components/Icon/OpenAPK';

Kreate comes in three builds. They share the same app, but differ in what is built into them,
how they update and where you get them.

| | FOSS | GitHub | Patreon |
| --- | --- | --- | --- |
| **Source code** | Fully open source | Open source, with some third-party services | Open source, with some closed-source libraries |
| **Telemetry** | None | Opt-in, off unless you turn it on | See the Patreon page |
| **Updates** | Through your app store | Built-in updater (OTA) | Through Patreon |
| **Features** | Core features | Core features | Core features plus advanced ones |
| **License** | Open source | Open source | A separate license |
| **Price** | Free | Free | For paid supporters |
| **Get it from** | F-Droid, IzzyOnDroid | GitHub, Obtainium, OpenAPK | Patreon |

:::tip Not sure which one to pick?

- You want only free and open-source software, with nothing sent anywhere: **FOSS**.
- You want the newest version as soon as it is out and updates from inside the app: **GitHub**.
- You support the project and want the advanced features: **Patreon**.

:::

## FOSS build

The FOSS build stays true to open source. It has **no telemetry** and **no closed-source
libraries**: every line that runs on your phone can be read and built by anyone.

Open source is about the code in the app, not the services it connects to. The FOSS build still
streams from YouTube Music, which is not free software, just like the other builds.

It has no built-in updater. Updates come through the store you installed it from.

### <FDroidLogo width='32px' /> F-Droid

[F-Droid](https://f-droid.org/packages/me.knighthat.kreate) builds Kreate from source on its own
servers. Kreate's builds are **reproducible**: F-Droid checks that its build matches the APK
Kreate published byte for byte, then ships the APK signed with Kreate's own key. You get the same
file as IzzyOnDroid, verified by a second, independent build.

F-Droid builds run in batches, so a new version usually reaches F-Droid a few days to a week after
it is released, sometimes longer.

### <IzzyOnDroidLogo width='32px' /> IzzyOnDroid

[IzzyOnDroid](https://apt.izzysoft.de/fdroid/index/apk/me.knighthat.kreate) is a separate
F-Droid repository. New versions usually appear there within a few hours of a release. To use it,
add the IzzyOnDroid repository to your F-Droid client, or use a client that includes it, such as
Droid-ify or Neo Store.

## <Icon icon='mdi:github' /> GitHub build

The GitHub build is published on the
[releases page](https://github.com/knighthat/Kreate/releases/latest) the moment a version is
ready, so it is always the newest.

It includes some third-party services that the FOSS build leaves out:

- **Built-in updater (OTA).** Kreate checks for new releases and installs them from inside the
  app, so you don't have to download each version by hand.
- **Opt-in telemetry.** Nothing is collected unless you turn it on.
- Other services that some features rely on.

You can also get the GitHub build through:

- <ObtainiumLogo width='20px' /> **[Obtainium](https://obtainium.imranr.dev/)**, which watches the
  GitHub releases page and notifies you of new versions. It installs the same APK as GitHub, so you
  get the built-in updater either way.
- <OpenAPKLogo width='20px' /> **[OpenAPK](https://www.openapk.net/kreate/me.knighthat.kreate/)**,
  a website that mirrors the APK. It serves the
  [uncompressed](/usr/faq/minified_and_full) APK, which is a larger download.

## <Icon icon='simple-icons:patreon' /> Patreon build

The Patreon build is only available on [Patreon](https://www.patreon.com/knighthat), for paid
supporters. It offers more advanced features than the other builds.

Kreate's own code in this build is open source, but some of the libraries that come with it to
provide those features are not. Because of them, the build is distributed under a different license
from the FOSS and GitHub builds. Read the terms on Patreon before you
install it.

## Switching between builds

F-Droid and IzzyOnDroid ship the same FOSS APK with the same signature, so you can move between
these two stores without reinstalling.

Switching to a different build (FOSS, GitHub or Patreon) may not work as an update. If Android
refuses to install it over your current app:

1. [Back up](/usr/features/backup/backup-and-restore) your library and settings.
2. Uninstall Kreate.
3. Install the new build and restore your backup.

To check that an APK really comes from Kreate, see
[How to verify signatures](/usr/how-to-verify-signatures).
