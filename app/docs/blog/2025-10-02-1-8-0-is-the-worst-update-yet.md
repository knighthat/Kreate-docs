---
title: v1.8.0 is the worst update yet
description: I failed you
authors: [knighthat]
image: https://i.ibb.co/DDYFYrcq/dislike-white-background.png
---

This update is the worst update I've made, the changes were good on paper. 
But in reality, it causes more instability than previous versions.

<!-- truncate -->

Since 1.7.x, I started implementing new things to the player service,
by offloading tasks to the background, tweaking some minor details. 
I hoped that it would increase performance. But boys, I was wrong. 

At the same time, I started noticing people get affected by the changes. 
At first, I shrugged it off because, you know, 
not everyone can benefit from a few changes, but someone might be negatively affected by it.

That number of people keeps growing as I add more changes behind the scene.
Until today, I decided to make a deep-dive to find the root cause of the problem.

> The root cause have yet to be found, but I've narrowed it down to a specific feature - **Persistent queue**.

## Setup

1. As mentioned, for the "bug" to exihit, `Persistent queue` must be enabled in the Settings.
2. Play a random song, and scrub to a random position, avoid 2 ends
   > _cached_ or _downloaded_ is preferred
3. Exit the app
4. (Optional) connect to a media player (e.g. Android Auto)

> It's **important** that you don't open the app again after 3rd step

## Symtoms

On your media player, you'll start seeing Kreate attempt to resume the song. 
But instead of load and play, it stucks at this cycle: load, stop, load, stop indefinitely.

If you're not using a media player, you'll notice your phone gets hotter after a while,
and the battery starts to drain faster

## The "fix"

I have yet to determine the problem. However, there are a couple things you can do
to avoid triggering this "bug"

1. Turning off `Persistent queue`
   > So far, turning of this setting "solves" the issue, because 
   > it doesn't force the player to start the song
2. Don't close the app - [step 3](#setup)
   > Not recommended, some Android builds kill the app in background
   > in order to save memory

## Conclusion

I would like to apologize for the trouble this has caused, it was
never an intention of mine.

