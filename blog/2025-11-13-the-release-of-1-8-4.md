---
title: The release of v1.8.4
description: It's a small update
authors: [knighthat]
tags: [release]
image: /img/blog/thumbnail-2025-11-13-the-release-of-1-8-4.webp
---

<!-- truncate -->

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Let's take a look at the release note:

<Tabs className="tabs--block">
  <TabItem value="fixes" label="Fixes">
    - Synced playlists fail to load on some accounts
  </TabItem>
  <TabItem value="changes" label="Changes" default>
    - Merge en_US to default language
    - Replace Norwegian (no) language with Norwegian Bokmål (nb)
  </TabItem>
</Tabs>

## Synced playlists are getting fixed

After a while, somebody's decided to provide a neccessary information to fix the issue.
And that somebody is [@yrrad8](https://gitlab.com/yrrad8).

## Merging languages

For the longest time, the default language has been the same as American English. 
They finally became one in this version, meaning there is no longer a need to maintain both files.

Additionally, `Norwegian` (**no**) language is being changed into `Norwegian Bokmål` (**nb**) 
as an effort to keep it up to standard. This will not effect existing translation, but it'll make
further mantainance job easier.