---
id: installing-the-apk
title: Installing the APK
description: "Install a Kreate APK you downloaded from GitHub or Patreon: allowing unknown apps, the install prompt and Play Protect."
slug: /usr/installing-the-apk
sidebar_position: 1
---

This page is for APKs you download yourself, from GitHub or Patreon. F-Droid and IzzyOnDroid
install Kreate for you; follow your store's prompts instead.

Not sure which APK to download? See [Why are there multiple APKs?](/usr/faq/multiple-apks).

The screens below come from one phone. Yours may look a little different, but the steps are the
same.

## 1. Open the APK

Open the downloaded file, from your browser's downloads or a file manager.

The first time you install an app from that browser or file manager, Android blocks it:

![For your security, your phone currently is not allowed to install unknown apps from this source. Cancel or Settings.](./img/blocked.webp)

Tap **Settings**.

## 2. Allow installing from this source

Turn on **Allow from this source**, then go back.

<div className="screens">

![Install unknown apps screen with Allow from this source turned on](./img/allow-from-this-source.webp)

</div>

This only allows the app you opened the APK with (here, Files) to install apps. You can turn it off
again once Kreate is installed; updates from Kreate's built-in updater ask separately.

## 3. Install

Android asks whether you want to install Kreate. Tap **Install**.

![Kreate: Do you want to install this app? Cancel or Install.](./img/install.webp)

![Kreate: Installing…](./img/installing.webp)

:::note[Google Play Protect]
Play Protect may ask to scan Kreate before installing it. You can skip the scan; Kreate installs
either way. Allowing the scan is completely fine too.
:::

## 4. Open Kreate

Tap **Open** to start Kreate. The [setup wizard](../Getting-started/first-launch.md) walks you
through the rest.

![Kreate: App installed. Done or Open.](./img/installed.webp)

## Something went wrong?

- **App not installed as app isn't compatible with your phone**: the APK is for a different
  processor. Download `kreate-universal.apk`; see
  [Why are there multiple APKs?](/usr/faq/multiple-apks).
- **App not installed as package conflicts with an existing package**: another Kreate build is
  already installed. See [Switching between builds](./choosing-your-build.md#switching-between-builds).
- Not sure the APK is genuine? [Verify it](/verify) before installing.
