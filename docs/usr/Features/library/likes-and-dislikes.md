---
sidebar_position: 6
slug: /usr/features/library/likes-and-dislikes
title: Likes and dislikes
description: "How likes and dislikes work, how they sync with YouTube Music and your server, and the Liked and Disliked pages."
---

Every song can be **liked**, **disliked** or neither. Use the buttons at the top of the song menu or
in the full player.

## Liking

A liked song shows up on the **Liked** page (Account → Liked).

- **YouTube Music** songs are also liked on your account while you're signed in and **Sync songs**
  is on.
- **OpenSubsonic** songs are starred (added to the server's favorites) while **Sync songs** is on.
  If the server refuses, the like is taken back and a message tells you.
- A song that wasn't in your library is added on its first like.

## Disliking

A disliked song is **hidden** from your lists and **removed from the queue** at once. It shows up on
the **Disliked** page (Account → Disliked).

To see disliked songs in a list anyway, turn on **Show disliked** in the Songs tab's or the
Downloaded page's sheet; they're marked with a thumb.

Where a dislike goes:

- **YouTube Music**: sent to your account while you're signed in and **Sync songs** is on.
- **OpenSubsonic**: the API has no dislike, so it stays on the device. Disliking a starred song
  unstars it on the server.
- Otherwise it stays on the device.

If the source refuses a like or dislike, it's taken back and a message says why.

:::note
YouTube Music can't list dislikes, so they're never pulled from your account. A song you disliked
while signed out, that YouTube Music still lists as liked, becomes liked again on the next sync.
:::

## The Liked page

- Songs newest first; the button in the bar flips to oldest first.
- Each row says how long ago you liked it.
- Source chips filter by source.
- Tap a song to play it alone.
- The sheet has **Unlike all**. It asks first, and says when songs will also be unliked on YouTube
  Music or removed from your server's favorites. With source chips selected, only the songs shown
  are unliked. One message sums up the result, with **Undo**.

## The Disliked page

The same layout, with **Undislike all** in the sheet. Undisliked songs show up in your lists again.
To take back one dislike, tap **Dislike** again in the song's menu.
