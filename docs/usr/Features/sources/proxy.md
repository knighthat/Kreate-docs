---
sidebar_position: 5
slug: /usr/features/sources/proxy
title: Network and proxies
description: "Network timeouts and retries, plus HTTP or SOCKS5 proxies for every source or just one."
---

**Settings → Network** holds the connection settings shared by every source.

## Requests

| Setting | Default | What it does |
|---------|---------|--------------|
| **Connect timeout** | 15 s | Time to reach a server before giving up. |
| **Read timeout** | 30 s | Time a server may go quiet in the middle of an answer. |
| **Retries** | 3 | Requests that got a server error are sent again. |

These are read when the app starts; the page's **restart** button applies them.

## Proxy

Turn on **Use a proxy**, then tap **Server**:

- **HTTP** or **SOCKS5**
- **Host** (without `http://`) and **Port** (1–65535)
- **Username** and **Password**, optional

Until it has a host and port, nothing is sent at all. **Clear** empties the proxy, **Save** keeps
it.

### Per-source proxies

YouTube Music and OpenSubsonic each have their own **Proxy** section. While a source's own proxy is
off, its requests go through the Network page's proxy. Turn it on to send that source somewhere
else, for example only YouTube Music through a proxy and your home server directly.

Everything of a source goes through its proxy: pages, streams and pictures.

:::caution
The YouTube Music sign-in page runs in a WebView. Some devices' WebView can't use a proxy, and it
can't sign in to a SOCKS5 proxy that needs a username. Use an HTTP proxy, or a SOCKS5 one without
a username, to sign in.
:::
