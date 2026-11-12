---
sidebar_position: 1
slug: /usr/features/backup/backup-and-restore
title: Backup and restore
description: "Save every profile, setting and your library to one file, and restore it on any device."
---

**Settings → Backup** saves everything to one file, and puts it back.

## What a backup holds

- Every profile and its settings
- The library: songs, albums, artists, playlists, likes and dislikes, history, your edits
- Pictures you chose for playlists, songs, albums and artists
- Fonts you picked

**Not included**: passwords, API keys and sign-ins. They stay on this device. Downloaded and cached
songs aren't included either.

## Back up

Tap **Back up** and choose where to save the file (named like
`kreate_backup_<version>_<date>_<time>.zip`). The row shows *Saving…* and then
*Backup saved*.

<div className="tutorial">

![Step 1, Open Settings: tap the gear at the top of the home screen.](./img/3-back-up/01-open-settings.webp)
![Step 2, Backup: tap Backup.](./img/3-back-up/02-backup.webp)
![Step 3, Back up: tap Back up. One file holds every profile with its settings and library, so back up from the Default profile.](./img/3-back-up/03-back-up.webp)
![Step 4, Save the file: choose where it goes, keep the suggested name and tap Save.](./img/3-back-up/04-save.webp)
![Step 5, Restore it later: the backup is now a file in that folder. Restore it from Settings, Backup, Restore, Pick backup.](./img/3-back-up/05-restore-later.webp)

</div>

To keep the backup safe from losing your phone, save it to a cloud drive or SD card: in step 4,
open the menu for other places.

## Restore

Tap **Restore** and choose a backup. It **replaces everything**: every profile, setting and the
library. The app restarts once it's done.

<div className="tutorial">

![Step 1: tap the gear on the home screen, then Backup.](./img/2-from-settings/01-settings.webp)
![Step 2: tap Restore.](./img/2-from-settings/02-restore.webp)
![Step 3, Replace everything: tap Pick backup and choose your backup file.](./img/2-from-settings/03-confirm.webp)
![Step 4, Pick your backup: tap the kreate_backup zip file. Every profile, setting and the library are replaced and the app restarts. Sign-ins on this device are kept.](./img/pick-backup.webp)

</div>

Sign-ins of profiles that exist both on this device and in the backup are kept.

If the restore fails, Kreate puts back what you had before.

:::note
Backup and restore are only available on the **default profile**.
:::

## During setup

The setup wizard's **Import** page restores a backup too, so a new device starts with your library
and settings. See [First launch](../../Getting-started/first-launch.md#3-import).

<div className="tutorial">

![Step 1, Start the setup: tap Get started.](./img/1-setup-wizard/01-welcome.webp)
![Step 2, Permissions (optional): grant Music and Notifications, then tap Next.](./img/1-setup-wizard/02-permissions.webp)
![Step 3, Restore a backup: tap it and choose your backup file.](./img/1-setup-wizard/03-restore.webp)
![Step 4, Pick your backup: tap the kreate_backup zip file. Every profile, setting and the library are replaced and the app restarts. Sign-ins on this device are kept.](./img/pick-backup.webp)

</div>

Finish the rest of the wizard as usual; the backup is restored when you tap **Start listening**.

## Older backups

A backup from an older version of Kreate can be restored by a newer version; a backup made by a
newer version than the one installed is refused, so update Kreate first. The
**old Kreate app's** export is also accepted: see
[Import from the old app](./import-from-old-kreate.md).
