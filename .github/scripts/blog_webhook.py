"""Post newly added blog posts to a Discord webhook.

Usage: blog_webhook.py <file.md> [<file.md> ...]
Requires DISCORD_WEBHOOK_BLOGS in the environment.
"""
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

import yaml

SITE = "https://kreate.knighthat.me"
FILENAME = re.compile(r"^(\d{4})-(\d{2})-(\d{2})(?:-(.+))?$")


def frontmatter(path: Path) -> dict:
    m = re.match(r"^---\n(.*?)\n---", path.read_text(encoding="utf-8"), re.S)
    return yaml.safe_load(m.group(1)) if m else {}


def post_url(path: Path, meta: dict) -> str | None:
    m = FILENAME.match(path.stem)
    if not m:
        return None
    year, month, day, name = m.groups()
    slug = str(meta.get("slug") or name or "").strip("/")
    return f"{SITE}/blog/{year}/{month}/{day}/{slug}".rstrip("/")


def send(webhook: str, embed: dict) -> None:
    req = urllib.request.Request(
        webhook,
        data=json.dumps({"embeds": [embed]}).encode(),
        headers={"Content-Type": "application/json", "User-Agent": "kreate-docs-blog-webhook"},
    )
    urllib.request.urlopen(req).read()


def main() -> None:
    webhook = os.environ["DISCORD_WEBHOOK_BLOGS"]
    for arg in sys.argv[1:]:
        path = Path(arg)
        meta = frontmatter(path)
        url = post_url(path, meta)
        if not url or not meta.get("title"):
            print(f"skip {path}: no title or date-prefixed filename")
            continue

        embed = {
            "title": str(meta["title"]),
            "url": url,
            "description": " ".join(str(meta.get("description", "")).split()),
            "color": 9321923,
        }
        image = meta.get("image")
        if image:
            embed["image"] = {"url": image if image.startswith("http") else SITE + image}
        send(webhook, embed)
        print(f"posted {url}")


if __name__ == "__main__":
    main()
