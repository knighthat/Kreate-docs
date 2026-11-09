import type { ReactNode } from 'react';
import { Icon } from '@Iconify';
import { usePluginData } from '@docusaurus/useGlobalData';

import styles from './discord.module.css';


type Invite = {
  url: string
  name: string
  description?: string
  icon: string | null
  online: number | null
  members: number | null
};

const countFormat = new Intl.NumberFormat( 'en' );

/** Invite card styled after Discord's own invite embed. Data comes from discord-invite-plugin at build time. */
export default function Discord(): ReactNode {
  const invite = usePluginData( 'discord-invite-plugin' ) as Invite;

  return(
    <div className={styles.card}>
      {/* Same URL as the hero background, so the browser reuses the cached file. */}
      <img className={styles.banner} src='/img/banner.webp' alt='' loading='lazy' />

      <div className={styles.body}>
        <span className={styles.iconWrap}>
          {invite.icon
            ? <img className={styles.icon} src={invite.icon} alt='' width={64} height={64} />
            : <Icon className={styles.icon} icon='bi:discord' />
          }
        </span>

        <h3 className={styles.name}>{invite.name}</h3>

        {invite.online !== null && invite.members !== null && (
          <p className={styles.stats}>
            <span><i className={styles.online} />{countFormat.format( invite.online )} Online</span>
            <span><i className={styles.members} />{countFormat.format( invite.members )} Members</span>
          </p>
        )}

        {invite.description && <p className={styles.description}>{invite.description}</p>}

        <a className={styles.join} href={invite.url} target='_blank' rel='noopener noreferrer'>
          <Icon icon='bi:discord' aria-hidden='true' />
          Join server
        </a>
      </div>
    </div>
  )
}
