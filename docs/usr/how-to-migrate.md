---
id: how-to-migrate
title: How to migrate
slug: /usr/how-to-migrate
sidebar_position: 1
---

## ❓ What is this?

[@knighthat](https://github.com/knighthat) releases a feature on old Kreate (`improvised` and `upstream` flavor) that allows user to seamlessly move their caches, database(s), and settings to new Kreate without breaking a sweat.

> Old Kreate will stop receiving updates after Mar 16 2025, unless it's related to migration issue.

:::note

Old Kreate will work, we don't break software to force update.

:::

:::warning

External API such as YouTube Music API **will** stop working one day, we can't do nothing about it, updating software to new version is the only way.

:::


## 🤔 Should I migrate my data?

If you have more than a few dozens of songs cached or downloaded, or you have all settings setup to your need and you don't feel like setting them up again, then the answer is **YES**!

If you are trying out the app and have not many to lose, I'd advise against it.

:::note

If you are not on `improvised` or `upstream` build, you are not required to migrate.

:::

## 🛠️ Create migration file

1. Go to  **Settings** > **Data** and look for **Create backup for migration**.

    ![Go to settings illustration](./img/go-to-settings.webp)

    ![Go to data settings illustration](./img/go-to-data-settings.webp)

    ![Create backup for migration illustration](./img/data-settings-create-backup-for-migration.webp)

2. Name your backup

    :::tip

    Default name will be assigned if you hit **_confirm_** with empty value

    :::

    ![Name your backup illustration](./img/name-your-migration-file.webp)

3. Select location

    > This is where your migration file is saved to, *_remember it_*

    :::note

    Each device has their own interface. But it should have some resemblance to the illustration below

    :::

    ![Select backup location illustration](./img/select-backup-location.webp)

## 📥 Import migration file

1. Install new Kreate

    > Remember to download `Kreate-full.apk` or `Kreate-upstream.apk` only.

    <a href="https://github.com/knighthat/Kreate/releases/latest">
        <img src="/get_it_on/github.png" width="300px" />
    </a>

1. Go to  **Settings** > **Data** and look for **Create backup for migration**.

    ![Go to settings illustration](./img/go-to-settings.webp)

    ![Go to data settings illustration](./img/go-to-data-settings.webp)

    ![Import migration file illustration](./img/data-settings-import-imgration-file.webp)

2. Select migration file

    ![Select migration file illustration](./img/select-migration-file.webp)

3. Restart your app

    :::warning

    Failure to restart your app may cause data corruption

    :::

    ![Restart you app prompt](./img/restart-your-app.webp)

## 🗑️ Delete old Kreate (optional)

You can safely delete your old Kreate and move on to new app.

But my advice is to use new Kreate for few days to detect any anomaly before completely delete old Kreate
