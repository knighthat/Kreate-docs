---
sidebar_position: 2
slug: /usr/features/backup/import-from-old-kreate
title: Import from the old Kreate app
sidebar_label: Import from the old app
description: "Bring profiles, likes, history and playlists over from the old Kreate app."
---

Kreate can take over the library of the old Kreate app.

## Steps

1. In the old app, export your data as one zip file.
2. In Kreate, choose that file:
   - in the setup wizard's **Import** page, or
   - under **Settings → Backup → Restore**.

The same Restore button handles both Kreate backups and the old app's export.

## What comes over

| Brought over | Notes |
|--------------|-------|
| Profiles | The first one stays the default profile, named *Default* |
| Songs, albums, artists | |
| Likes and dislikes | |
| Listening history | |
| Playlists | As local playlists; unnamed ones become *Playlist-1*, *Playlist-2*…; monthly playlists stay monthly |

**Not brought over**: the old app's settings, lyrics, saved queue and device songs (the
[local scan](../sources/local-files.md) finds those again).

Like any restore, the import **replaces everything** in Kreate.

## Old downloads

Downloaded files aren't moved; the songs are downloaded again. After the import, Kreate asks about
the songs the old app had downloaded:

| Choice | What happens |
|--------|--------------|
| **Download all** | Downloads every one of them |
| **Select** | Opens a list to pick from; **Select all** and **Clear all** help. Leaving the list downloads the songs you picked (none is fine). |
| **Close** | Downloads nothing |

Songs that can't be found anymore are left out of the list.
