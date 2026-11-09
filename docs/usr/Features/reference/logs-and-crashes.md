---
sidebar_position: 2
slug: /usr/features/reference/logs-and-crashes
title: Logs and crash reports
description: "Collect logs and crash reports to report a problem."
---

When something goes wrong, a log helps track it down. Logs stay on your device until you share
them.

## Logging settings

**Settings → General → Logging**:

| Setting | Default | What it does |
|---------|---------|--------------|
| **Log level** | Warning | How much is written: Verbose, Debug, Info, Warning or Error |
| **Rollover size** | 1 MiB | A new file starts once the current one is this big |
| **Keep** | 5 | Older files kept besides the current one |
| **Delete crash logs after** | 30 days | Crash logs this old are deleted when the app starts |
| **Export** | | Save the log files as a zip |
| **Copy** | | Copy the latest part of the log |

To report a problem, set the log level to **Debug**, make the problem happen again, then **Export**
or **Copy**.

Passwords, tokens, cookies and addresses with sign-in details are removed before anything is
written.

## When the app crashes

A crash screen opens: *Something went wrong. Share the log below when you report it.*

| Button | What it does |
|--------|--------------|
| **Copy** | Copies the crash log |
| **Export** | Saves it as a file |
| **Restart** | Opens the app again |
| **Close** | Closes it |

## Reporting

**Settings → About → Report issue** opens the issue tracker on GitHub. Attach the log.
