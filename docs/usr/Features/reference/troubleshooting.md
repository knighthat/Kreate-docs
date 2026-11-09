---
sidebar_position: 3
slug: /usr/features/reference/troubleshooting
title: Troubleshooting
description: "Fixes for songs that won't play, unreachable servers, missing local songs and other common problems."
---

## A song won't play

- Kreate shows why in a message. What happens next follows
  **Settings → Player → Queue → When a song fails**.
- A YouTube Music song that's age-restricted needs **Login for playback** set to *On-failure* or
  *Always*, and a signed-in account.
- If a song loads forever, lower **Give up loading after** so it fails (and skips) sooner.

## My server can't be reached

The **Configure OpenSubsonic** row tells you what's wrong:

| Status | What to do |
|--------|------------|
| *Can't reach …* | Check the address and that the server is up and reachable from the phone |
| *… certificate isn't trusted* | The server uses its own certificate: turn on **Allow self-signed certificate** |
| *… certificate changed* | Review the new certificate; trust it only if you replaced it |
| *Not an OpenSubsonic server* | The address points elsewhere; check the path |
| *Wrong username or password* / *Invalid API key* | Sign in again |

## YouTube Music signed me out

The row says *The session ended, tap to sign in again*. Your liked songs stay liked.

## Local songs are missing

- Allow the **Music** permission (the setting says *Tap to allow…* when it's missing).
- Check **Settings → General → Library → Scan local media** is on.
- New files are found at the next scan (every **Scan interval**, and at app start).

## Some songs disappeared from my lists

They may be **disliked**. Disliked songs are hidden everywhere; see **Account → Disliked**, or turn
on **Show disliked** in the Songs tab's sheet.

## Kreate takes too much room

See [Storage and caches](../offline/storage.md): lower or clear the song cache and the image cache.

## A setting didn't apply

Some settings need a restart. Use the **restart** button in the settings page's top bar.

## Still stuck?

[Collect a log](./logs-and-crashes.md) and report the issue from **Settings → About → Report
issue**.
