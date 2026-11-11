import type { ReactNode } from 'react';
import { Icon } from '@Iconify';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';

import styles from './discord.module.css';


type Invite = {
  url: string
  name: string
  description?: string
  icon: string | null
  online: number | null
  members: number | null
};

/** Invite card styled after Discord's own invite embed. Data comes from discord-invite-plugin at build time. */
export default function Discord(): ReactNode {
  const invite = usePluginData( 'discord-invite-plugin' ) as Invite;
  const { i18n } = useDocusaurusContext();
  const countFormat = new Intl.NumberFormat( i18n.currentLocale );

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
            <span>
              <i className={styles.online} />
              <Translate id='home.discord.online' values={{ count: countFormat.format( invite.online ) }}>
                {'{count} Online'}
              </Translate>
            </span>
            <span>
              <i className={styles.members} />
              <Translate id='home.discord.members' values={{ count: countFormat.format( invite.members ) }}>
                {'{count} Members'}
              </Translate>
            </span>
          </p>
        )}

        {invite.description && <p className={styles.description}>{invite.description}</p>}

        <a className={styles.join} href={invite.url} target='_blank' rel='noopener noreferrer'>
          <Icon icon='bi:discord' aria-hidden='true' />
          <Translate id='home.discord.join'>Join server</Translate>
        </a>
      </div>
    </div>
  )
}
