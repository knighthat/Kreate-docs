---
sidebar_position: 2
slug: /usr/features/backup/import-from-old-kreate
title: Import from the old Kreate app
sidebar_label: Import from the old app
description: "Bring profiles, likes, history and playlists over from the old Kreate app."
---

Kreate can take over the library of the old Kreate app.

## Steps

1. In the old app, export your data as one zip file (named like `Kreate_migration_….zip`).
2. In Kreate, choose that file, either [during setup](#during-setup) or
   [from Settings](#from-settings). The same Restore button handles both Kreate backups and the
   old app's export.

### During setup

A fresh install of Kreate opens the setup wizard. Its **Import** step brings your old library over.

<div className="tutorial">

![Step 1, Start the setup: the Import step brings your old library over. Tap Get started.](./img/1-setup-wizard/01-welcome.webp)
![Step 2, Permissions (optional): grant Music and Notifications, then tap Next.](./img/1-setup-wizard/02-permissions.webp)
![Step 3, Restore a backup: tap it and choose the migration file you exported from the old app.](./img/1-setup-wizard/03-restore.webp)
![Step 4, Pick the migration file: open the folder you saved it to and tap the Kreate_migration zip file.](./img/1-setup-wizard/04-pick-file.webp)
![Step 5, Backup ready: the file is checked and kept, and restored once setup finishes. Tap Next.](./img/1-setup-wizard/05-backup-ready.webp)
![Step 6, Sign in (optional): sign in to YouTube Music or an OpenSubsonic server, or tap Next to skip.](./img/1-setup-wizard/06-sign-in.webp)
![Step 7, Choose your settings: the old app settings are not imported, so pick a profile name, theme and stream quality.](./img/1-setup-wizard/07-basic-settings.webp)
![Step 8, Finish the setup: read the terms and tap Start listening. Kreate restarts and imports your library.](./img/1-setup-wizard/08-finish.webp)

</div>

The old app's settings aren't imported, so step 7 is where you pick a profile name, theme and
stream quality. Leave the name empty to keep *Default*.

### From Settings

Already set up Kreate? Import from **Settings → Backup → Restore** instead.

<div className="tutorial">

![Step 1: tap the gear on the home screen, then Backup.](./img/2-from-settings/01-settings.webp)
![Step 2: tap Restore.](./img/2-from-settings/02-restore.webp)
![Step 3, Replace everything: tap Pick backup and choose the Kreate_migration zip file.](./img/2-from-settings/03-confirm.webp)
![Step 4, Pick the migration file: open the folder you saved it to and tap the Kreate_migration zip file.](./img/1-setup-wizard/04-pick-file.webp)

</div>

The import replaces every profile, setting and song in Kreate. The app then restarts with your old
library.

## What comes over

| Brought over | Notes |
|--------------|-------|
| Profiles | The first one stays the default profile, named *Default* |
| Songs, albums, artists | |
| Likes and dislikes | |
| Listening history | |
| Playlists | As local playlists; unnamed ones become *Playlist-1*, *Playlist-2*…; monthly playlists stay monthly |

<div className="tutorial">

![Your library is back: songs come with their likes, play counts, albums and artists.](./img/1-setup-wizard/10-songs.webp)
![Playlists too: every old playlist is now a playlist on this device.](./img/1-setup-wizard/11-playlists.webp)

</div>

**Not brought over**: the old app's settings, lyrics, saved queue and device songs (the
[local scan](../sources/local-files.md) finds those again).

Like any restore, the import **replaces everything** in Kreate.

## Old downloads

Downloaded files aren't moved; the songs are downloaded again. After the import, Kreate asks about
the songs the old app had downloaded:

<div className="tutorial">

![Downloads from the old app dialog, with Download all, Select and Close](./img/1-setup-wizard/09-old-downloads.webp)

</div>

| Choice | What happens |
|--------|--------------|
| **Download all** | Downloads every one of them |
| **Select** | Opens a list to pick from; **Select all** and **Clear all** help. Leaving the list downloads the songs you picked (none is fine). |
| **Close** | Downloads nothing |

Songs that can't be found anymore are left out of the list.
