---
sidebar_position: 5.5
slug: /docs/features/library/import-and-export
title: Import and export playlists
description: "Save local playlists to CSV files, import them back, and bring over playlists from Spotify and the old Kreate app."
---

Playlists can travel as **CSV files**: export a local playlist to keep it or share it, and import
files made by Kreate, the [old Kreate app](../backup/import-from-old-kreate.md) or
[Exportify](https://exportify.app) (Spotify).

## Exporting a playlist

On a **local** playlist's page, ⋮ → **Export playlist**. The dialog asks which sources to
**Include songs from**: every source the playlist has songs from is ticked, sources it has none from
are grayed out. Tap **Export** and choose where to save the file.

- Songs are written as their source has them; titles, artists and covers you
  [edited](./editing.md) aren't exported.
- Disliked songs are left out.

Playlists of YouTube Music and your OpenSubsonic server live on their source already, so they
have no export.

## Importing a file

On the Playlists tab, open the sheet and tap **Import from file**, then pick a `.csv` file. Every
playlist in the file becomes a **local** playlist.

While a file is imported, a placeholder with the playlist's name sits at the top of the tab and
says what it's doing (reading, looking up, searching, saving). Progress and the result also show
in a notification (channel *Playlist imports*): *imported successfully*, or *imported with errors*
with a line for each song that couldn't be imported. You can leave the app meanwhile.

A file whose columns Kreate doesn't know is refused with *Not a playlist file*.

### Files from Kreate and the old app

When the file has YouTube Music songs, Kreate asks **Look up songs again?**, with an estimate of
how long it takes:

| Choice | What happens |
|--------|--------------|
| **Look up** | Gets each song's current title and artists from YouTube Music. A song YouTube has replaced with a new upload is searched for and imported as the new one. |
| **Skip** | Imports the songs as the file has them, without any request |

Offline, the dialog isn't shown and the songs go in as the file has them. If a song in the file
was removed or made private, YouTube refuses the whole look-up: the songs are imported as the
file has them and a message says so.

Device songs are matched to the songs already on your device. Songs already in your library keep
what you have.

### Spotify playlists (Exportify)

Spotify doesn't export playlists itself. Use [Exportify](https://exportify.app): sign in with
Spotify, export the playlist, and import the `.csv` it downloads.

Kreate then asks **Search for the songs?**. You can change the playlist's name (it starts as the
file's name), and the dialog estimates how long the search takes. Tap **Search**:

- each song is looked for in your library first, then searched on YouTube Music, by title,
  artists and length;
- a result naming another version (instrumental, remix, live…) isn't taken;
- songs without a confident match are **left out** and counted in the result.

The placeholder shows *Searching 120 of 1,722* as it goes. A big playlist takes a while: by
default Kreate sends at most 2 searches a second (see below). If YouTube Music can't be reached or
starts refusing, searching stops and the remaining songs are left out.

## Search speed

**Settings → Network → Configure YouTube Music → Requests → Searches per second** (1 to 5,
default 2) limits how fast songs are searched when many are looked for one after another, like
the songs of an imported file. Higher is faster, but YouTube may start refusing.
