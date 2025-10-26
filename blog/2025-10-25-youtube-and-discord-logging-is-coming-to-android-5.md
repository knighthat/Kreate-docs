---
title: YouTube and Discord logging is coming to Android 5
description: Finally, some support for the soon-to-be obsolete version
authors: [knighthat]
tags: [news, update-progress]
image: /img/blog/thumbnail-2025-10-25-youtube-and-discord-logging-is-coming-to-android-5.webp
---

:::danger
App's internal is generally inaccessible by other apps. However, since
Android 5 is such an old version, there are many unknown vulnerabilities
that can exploit and gain access to these files.
:::

<!-- truncate -->

## Introduction

As a part of CI/CD, keeping dependencies up-to-date is our utmost priority.
Consequently, when a dependency goes out of service, or stops supporting a
certain Android version, our option is limited to 2 options: 

1. Replace with compatible library and move on
2. Also stop supporting for that version

## Library in question

[androidx.security:security-crypto](https://developer.android.com/jetpack/androidx/releases/security)

This library will be removed in upcoming version

## Reasons to why?

In this case, we chose to drop the library entirely due to 2 main reason:

### Inessential 

This library provides a way to encrypt login credentials saved in a designated file.

However, this is generally not needed because the internal storage of an app
is already inaccessible to the public. And the file isn't going to be exported
to the user-accessible storage.

### Security concerns

A library whose job was to keep your data safe, now becomes another attack vector.
Therefore, it's not worth keeping in the project.

## Conclusion

As mentioned, Android 5 will be able to enable both YouTube login and Discord RPC.

> But this is highly unrecommended

And for others, who are already using these feature, you'll have to login again.

This is required because the library is removed, meaning, there's no way we can
recover the encrypted data.

---

Thank you for using Kreate! We'll be seing you in the next post.