import type {ComponentType, ReactNode} from 'react';
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/Blog/Components/Author/Socials';

import Twitter from '@theme/Icon/Socials/Twitter';
import GitHub from '@theme/Icon/Socials/GitHub';
import X from '@theme/Icon/Socials/X';
import StackOverflow from '@theme/Icon/Socials/StackOverflow';
import LinkedIn from '@theme/Icon/Socials/LinkedIn';
import DefaultSocialIcon from '@theme/Icon/Socials/Default';
import Bluesky from '@theme/Icon/Socials/Bluesky';
import Instagram from '@theme/Icon/Socials/Instagram';
import Threads from '@theme/Icon/Socials/Threads';
import Youtube from '@theme/Icon/Socials/YouTube';
import Mastodon from '@theme/Icon/Socials/Mastodon';
import Twitch from '@theme/Icon/Socials/Twitch';

import styles from './styles.module.css';
import GitLab from '@site/src/theme/Icon/Socials/GitLab';


type SocialIcon = ComponentType<{className: string}>;

type SocialPlatformConfig = {Icon: SocialIcon; label: string};

const SocialPlatformConfigs: Record<string, SocialPlatformConfig> = {
  twitter: {Icon: Twitter, label: 'Twitter'},
  github: {Icon: GitHub, label: 'GitHub'},
  stackoverflow: {Icon: StackOverflow, label: 'Stack Overflow'},
  linkedin: {Icon: LinkedIn, label: 'LinkedIn'},
  x: {Icon: X, label: 'X'},
  bluesky: {Icon: Bluesky, label: 'Bluesky'},
  instagram: {Icon: Instagram, label: 'Instagram'},
  threads: {Icon: Threads, label: 'Threads'},
  mastodon: {Icon: Mastodon, label: 'Mastodon'},
  youtube: {Icon: Youtube, label: 'YouTube'},
  twitch: {Icon: Twitch, label: 'Twitch'},
  gitlab: {Icon: GitLab, label: 'GitLab'},
};

function getSocialPlatformConfig(platformKey: string): SocialPlatformConfig {
  return (
    SocialPlatformConfigs[platformKey] ?? {
      Icon: DefaultSocialIcon,
      label: platformKey,
    }
  );
}

function SocialLink({key, platform, link}: {key: string, platform: string; link: string}) {
  const {Icon, label} = getSocialPlatformConfig(platform);
  return (
    <Link key={key} className={styles.authorSocialLink} href={link} title={label}>
      <Icon className={clsx(styles.authorSocialLink)} />
    </Link>
  );
}

export default function BlogAuthorSocials(
  { author }: { author: Props['author']; }
): ReactNode {
  const entries = Object.entries(author.socials ?? {});

  return (
    <div className={styles.authorSocials}>
      {entries.map(([platform, linkUrl]) => {
        const link = platform == 'gitlab' ? `https://gitlab.com/${linkUrl}` : linkUrl
        return <SocialLink key={platform} platform={platform} link={link} />;
      })}
    </div>
  );
}
