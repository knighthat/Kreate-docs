import type { ReactNode } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';

import styles from './styles.module.css'


export type Build = 'foss' | 'github' | 'patreon'

type Platform = {
  /** Display name; also the file name under /img/get-it-on/. */
  name: string
  /** Slug of the /download/<slug> redirect in vercel.json. */
  slug: string
  /** Which Kreate build this platform distributes. */
  build: Build
  /** Also shown on the homepage banner. */
  featured?: boolean
}

/** Every place Kreate can be downloaded from, in the order the downloads page shows them. */
export const PLATFORMS: Platform[] = [
  { name: 'GitHub', slug: 'github', build: 'github', featured: true },
  { name: 'F-Droid', slug: 'f-droid', build: 'foss', featured: true },
  { name: 'IzzyOnDroid', slug: 'izzyondroid', build: 'foss' },
  { name: 'Obtainium', slug: 'obtainium', build: 'github' },
  { name: 'OpenAPK', slug: 'openapk', build: 'github' },
  { name: 'Patreon', slug: 'patreon', build: 'patreon', featured: true },
];

export function Badge( { name, slug, className }: Pick<Platform, 'name' | 'slug'> & { className?: string } ): ReactNode {
  return(
    <a className={clsx('padding--none', className)} href={`/download/${slug}`} >
      <img className={styles.badge} src={`/img/get-it-on/${name}.webp`} width={388} height={150} alt={translate(
        { id: 'home.badge.alt', message: '{platform} download page', description: 'Alt text of a "Get it on" badge; {platform} is a store name like F-Droid' },
        { platform: name },
      )} />
    </a>
  )
}

/** The featured badges, for the homepage banner. */
export function InlineBadges( { className }: { className?: string } ): ReactNode {
  return(
    <div className={className}>
      {PLATFORMS.filter( p => p.featured ).map( p => <Badge key={p.slug} name={p.name} slug={p.slug} /> )}
    </div>
  )
}

/** The badges of one build, for the downloads page. */
export function BuildBadges( { build, className }: { build: Build, className?: string } ): ReactNode {
  return(
    <div className={className}>
      {PLATFORMS.filter( p => p.build === build ).map( p => <Badge key={p.slug} name={p.name} slug={p.slug} /> )}
    </div>
  )
}
