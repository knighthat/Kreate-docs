---
title: Upcoming changes to Kreate
authors: [knighthat]
tags: [news]
---

Up until v2.0.0, we tried to keep the app compatible to the original RiMusic app.
But that's not the case anymore.

<!-- truncate -->

## Database

Previously, we tried to keep some components such as database, exported file structure
close to the original design of RiMusic app. This means that other fork of RiMusic
would be able to pickup and use normally.

However, starting with v2.0.0, changes will be made to the database
to align with modern development patterns and standards.
And more features will be introduced that require certain
modification to the database's structure.

This change renders other fork(s) of RiMusic that support legacy database
useless as it requires the other dev(s) to explicitly add support
for Kreate's database.

## Exported files

The same thing can be said for exported files.

Some changes will be made in order to improve the experience of users,
but it comes with the cost of breaking backward compatibility.

CSV files on the other hand, it's more susceptible to changes, as long
as the old structure presents, other software can easily read information
from the file.

## Other changes

As of the time of writing, there's no plan to have other files other
than the two mentioned above changed.

We will keep you up-to-date on this matter.
