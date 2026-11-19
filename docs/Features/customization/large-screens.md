---
sidebar_position: 3
slug: /docs/features/customization/large-screens
title: Tablets and landscape
description: "How Kreate uses the room of tablets, foldables and phones turned sideways."
---

Kreate changes its layout by itself when the window is wide; there's nothing to switch on.

## Tabs in a rail

From 600 dp of width (most tablets, unfolded foldables and many phones turned sideways), the
four library tabs move from the bottom bar to a **rail** along the left edge.

[Song recognition](../library/song-recognition.md) works the same: hold the Songs tab in the rail.

## Side-by-side pages

When the window is at least 600 dp wide **and** wider than tall, album, artist and playlist pages
split in two:

- **Left**: the cover or picture with the name, artists, description and details. It scrolls on
  its own.
- **Right**: the songs. **Play**, **Shuffle**, **Play next** and **Add to queue** sit as buttons
  above the list, so the ⋮ sheet leaves them out.

Turned upright, the same pages go back to one column.

## Full player

In the same wide windows the full player shows two panes over a blurred copy of the cover: the
song with its controls on the left, and the **Queue** or **Lyrics** on the right (Queue first).
