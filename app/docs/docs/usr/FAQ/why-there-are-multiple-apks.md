---
id: multiple-apks
title: Why are there multiple APKs?
---

The developers of Kreate always aim for better performance. Consequencially,
some actions require us to make separate builds of the same app to achive
this goal.

## 📋 What are these processes?

Currently, Kreate uses 2 main optimization processes. These optmizations include:

1. [R8](https://www.thelasttech.com/android/what-is-r8-optimizer-in-android-development) for _code minification_ (remove unused code and assets)
2. Build app for a specific [instruction set](https://en.wikipedia.org/wiki/Instruction_set_architecture) ([ABI](https://developer.android.com/ndk/guides/abis))

## ❓ Why?

R8 is just a process of removing unused code, assets and alike during the build
process to ensure what's needed are kept and nothing else.

ABI is a bit more complicated than that.  But it can be distilled down to:
***Remove binaries that the CPU can't process***.

### In-depth explanation

Even though Kreate is written in [Kotlin](https://kotlinlang.org) - a
[high-level programing language](https://en.wikipedia.org/wiki/High-level_programming_language).
Kreate uses some 3rd party libraries that compiled partially or wholy to binaries.

Due to the nature of lowlevel binary code,
it must be written for each intruction set.\
This means multiple binaries for the same function. And ofcourse, it is wasteful
because your phone can only process 1 of the binary files, other files are there
for the just-in-case situation.

Here comes the ABI splitting, this process tells the compiler that the output APK
can only be installed by CPU with this instruciton set,
so remove other binaries file.

Combining this process with R8 produces the smallest file possible with truly needed
code and nothing else.

## 🤔 What can it do to profit the users?

The R8's lifting most of the weight in current builds,
as it reduces the size (aprox.) by half.

APKs for inidividual architecture are sitll in experimental
phrases. The change will have more impact as we implement more
features, but for now, the impact is minimal.

## 📱 Available options

Currently, there are 4 main architectures:
`armeabi-v7a`, `arm64-v8a`, `x86`, and `x86_64`.

You must confirm your phone's cpu before downloading the appropriate
version, because one can't be installed on another.

## ♾️ Is there a universal build?

**YES**! `Kreate-release.apk` and `Kreate-uncompressed.apk` are universal builds.