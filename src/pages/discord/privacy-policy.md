# Privacy Policy

Last update: Nov 12, 2026 · [@knighthat](https://github.com/knighthat)

Kreate's Discord Rich Presence feature sends what you are listening to to Discord, and we do not collect, sell, or keep personal information about you on our own servers. Effective date: November 12, 2026.

This policy explains what the Kreate Music App ("Kreate", "we", "us") handles when you connect Discord. Kreate is operated by Knight Hat.

## 1. Information involved

**Discord sign-in (OAuth2).** When you connect Discord, you sign in through Discord's own authorization page. Kreate never sees your Discord password. Kreate receives an access token from Discord for the permissions (scopes) you approve. The token is used only to update your Rich Presence and is kept only on your device, in the App's local storage. During sign-in, the token passes through Kreate's server only to complete authorization, after which it is discarded and not stored.

**Presence details.** To update your presence, Kreate sends Discord the information about what you are playing: track title, artist, album, playback start and end times, and an image (artwork).

**Artwork from local files.** If the artwork for a track is a file stored on your device, Discord cannot display it directly. In that case Kreate uploads the image to a third-party image host, [Litterbox](https://litterbox.catbox.moe), to get a temporary public link, then sends that link to Discord. The host usually deletes the image within 24 hours. If the artwork is already online, its existing link is sent straight to Discord and nothing is uploaded.

## 2. What we do not collect

Apart from the sign-in step described in [section 1](#1-information-involved), we do not run a server that receives your Discord account details, listening history, or presence data. We do not collect your name, email address, location, or device identifiers for the Rich Presence feature, and we do not use analytics or advertising trackers for it.

## 3. How the information is used

We use it only to make your Discord Rich Presence work: to sign you in through Discord, to show what you are playing, and to display artwork. We do not use it for advertising, profiling, or sale.

## 4. Third parties that receive information

| Recipient | What it receives | Why |
| --- | --- | --- |
| Discord | Your authorization token and the presence details above | To display your Rich Presence. Discord's handling is covered by [Discord's Privacy Policy](https://discord.com/privacy). |
| Litterbox | Artwork image files that live only on your device | To create a temporary public link Discord can display |

We do not sell your information or share it with anyone else, except where the law requires it.

## 5. Retention

Artwork uploaded to the image host is usually deleted within 24 hours. We keep no copy. We store no presence data on our own servers, and the token handled during sign-in is discarded rather than stored. Your Discord token stays on your device until you disconnect Discord or uninstall the App.

## 6. Personal content in artwork

Images from your own files can contain personal content, such as a photo you set as album art. A temporary link to that image is publicly reachable by anyone who has the URL until the host deletes it, and Discord may show it to people who can see your presence. If you do not want that, do not use personal images as artwork while Rich Presence is on, or turn Rich Presence off.

## 7. Your choices and rights

- **Disconnect:** turn off Rich Presence or disconnect Discord in the App at any time.
- **Revoke access:** in Discord, go to Settings, then Authorized Apps, and remove Kreate. This invalidates the token.
- **Delete data:** uninstalling the App or clearing its data removes the token stored on your device. To ask for removal of an uploaded image before the host deletes it, email contact@knighthat.me with the details, and we will contact the host where we are able to.
- **Access, correction, deletion:** because we hold no personal data on our own systems, there is usually nothing to access or correct. If you are in the EU/UK (GDPR) or California (CCPA), you still have the rights those laws give you, and you can exercise them by emailing contact@knighthat.me.

## 8. Children

Kreate's Rich Presence feature is not meant for children under 13, which is also Discord's minimum age. We do not knowingly collect information from them. If you believe a child has used the feature, contact us and we will help remove what we can.

## 9. Security

Tokens are kept on your device, and artwork is sent to the image host over an encrypted connection. No system is perfectly secure, so we cannot guarantee absolute security.

## 10. Changes to this policy

We may update this policy. The current version will always be at this page, with a new effective date at the top. If a change materially affects what is collected, we will say so in the App or on the project page.

## 11. Contact

Questions or requests about privacy: contact@knighthat.me.
