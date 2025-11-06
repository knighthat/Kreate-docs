---
id: building_kreate
title: Building Kreate
sidebar_position: 2
---

<div class="callout">
  When you want to have your own changes in Kreate, then building your own app is your option.
</div>

## ✅ Prerequisites

:::warning
    You **shouldn't** attempt to build the app with a computer that has
    less than 6GB of RAM.

    The build process will slow down significantly and may result in failure,
    or the system will terminate it to preverse resources.
:::

1. A computer
2. **Internet**

<div class="callout">
  **Only needed to download dependencies. No internet connection required to build the app**.
</div>

## 📋 Checklist

1. [Download & install Java 21 (or above)](/dev/guides/how-to-install-java-21)
2. [Have a clone of the repo locally](/dev/getting_started)
3. Register release notes

### Register release notes

Kreate requires a `release_notes.txt` to be included at build time.
This file contains all the changes made between last version and this version

<div class="callout">
  This file doesn't stay in the repo to prevent the build from accidentally
  including old release notes. Kind of a fool-proof step.
</div>

For personal build, you can just copy any text file from `fastlane/metadata/android/en-US/changelogs/`
and paste it in `composeApp/src/androidMain/res/raw/release_notes.txt`

:::warning[File naming]

    The file must be naled `release_notes.txt` for it to work
:::


## 🔠 Your options

There's no difference between these 2 options, only their sizes. Find explanation [here](/usr/faq/minified_and_full)

### Release (compressed)

> This is the recommended way


| Pros | Cons |
| -- | -- |
| Smaller build size | Slow build time |
| | Consumes more resources during build process |

Now execute this command within project's folder to start the build Kreate:

```sh
./gradlew assembleGithubRelease
```

You'll get this once it's completed

```sh
BUILD SUCCESSFUL in 1m 22s
71 actionable tasks: 28 executed, 43 up-to-date
```

Your file is now available in `composeApp/build/outputs/apk/github/release/Kreate-release.apk`

### Uncompressed

| Pros | Cons |
| -- | -- |
| Faster to build | Bigger build size |
| Consumes less resources during build process | |

Now execute this command within project's folder to start the build Kreate:

```sh
./gradlew assembleGithubUncompressed
```

You'll get this once it's completed

```sh
BUILD SUCCESSFUL in 1m 22s
71 actionable tasks: 28 executed, 43 up-to-date
```

Your file is now available in `composeApp/build/outputs/apk/github/uncompressed/Kreate-uncompressed.apk`


## ✍️ Signing your app

Android will not allow you to install unsigned APK willy-nilly.
Steps shown above didn't cover it, and there's currently no
documents that show you either.

But here's a [tutorial from Medium](https://medium.com/@thedancercodes/signing-your-apks-the-pragmatic-way-396e316981ca).


## 🏁 Final step

Copy signed APK to your phone and start the installation.

If you have another instance of Kreate on your phone,
you might be asked to remove before installing this version.

<div class="callout">
  Only when you didn't change `namespace` and `packageId`, which you
  didn't if you followed this article alone.
</div>

## 🪲 Issues

If you encounter any issue during build process. Please submit an [issue ticket](https://github.com/knighthat/Kreate/issues)
