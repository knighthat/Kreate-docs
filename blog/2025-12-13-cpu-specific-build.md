---
title: Devilering app optimized for your CPU
description: Impact is unnoticeable for now, but big in the future
authors: [knighthat]
tags: [news, update-progress]
---

From 1.8.5 and onward, Kreate will be built and optimized for multiple [CPU architecture](https://en.wikipedia.org/wiki/Computer_architecture).

<!-- truncate -->

## What is this?

This is the process of filtering out unecessarry code during the code build and only
keep what the CPU can actually understand and 

## Why?

Even though Kreate is wrriten in Kotlin, which is a high level language.
Some of its dependencies are written partially in navtive code (C/C++).

Due to the nature of these languages, it must be written for a single
architecture.

This means that a fucntion or a process must be rewritten as many time as
existing architectures.

This creates unused code, because one's code can't be used by another.
And the minification of [R8](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization)
will usually ignore native code because they are already compiled. 
Which result in abundant storage to store unusable binaries.

With the new system, the build process will actively remove binaries
that this architecture can't process.

The final result is a smaller APK file, and potentially, better optimized app.

## How do I know which one to use?

To obtain phone's [abi](https://developer.android.com/ndk/guides/abis), you need to 
look up the manufacturer and model with "CPU instruction". It'll give you
more details on that.

There are 4 main intruction sets: `armeabi-v7a`, `arm64-v8a`, `x86`, and `x86_64`.

Once you get a hold of your phone's architect. Just download the matching file name
to your phone and install it normally.

Here's the naming scheme: `Kreate-<arch>.apk`

:::tip
Assume your phone's instruction sets is: `armeabi-v7a`.
Then you need to download `Kreate-armeabi-v7a.apk`
:::

## Can I continue using Kreate-release.apk?

**Yes**, you can. Kreate is still being built for most architectures like before
under the name of `Kreate-release.apk`. If you are unsure about your phone, just
download this version and continue using it normally.

