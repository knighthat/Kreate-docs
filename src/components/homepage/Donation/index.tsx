import { useEffect, useState, type ReactNode, type CSSProperties } from 'react';
import { Icon } from '@Iconify';
import Translate, { translate } from '@docusaurus/Translate';

import styles from './styles.module.css';


type Platform = {
  name: string
  icon: string
  color: string
  url: string
  note: string
};

type Wallet = {
  name: string
  icon: string
  color: string
  ticker: string
  address: string
};

// A function so translate() runs at render time, in the visitor's locale.
const getPlatforms = (): Platform[] => [
  {
    name: 'Patreon',
    icon: 'simple-icons:patreon',
    color: '#ff424d',
    url: 'https://patreon.com/knighthat',
    note: translate({ id: 'home.donation.patreonNote', message: 'Monthly support' }),
  },
  {
    name: 'Liberapay',
    icon: 'simple-icons:liberapay',
    color: '#f6c915',
    url: 'https://liberapay.com/knighthat',
    note: translate({ id: 'home.donation.liberapayNote', message: 'Recurring donations' }),
  },
];

const wallets: Wallet[] = [
  {
    name: 'Monero',
    icon: 'simple-icons:monero',
    color: '#ff6600',
    ticker: 'XMR',
    address: '44G5dUFTbFWYfZAk69irnDUCTNZzP5viNTmkGpCNCLHjjYQq7jjRTWoYTH1aY8P841hExP31Qxg2hXPtxreKu11zCYdxQUj',
  },
  {
    name: 'Bitcoin',
    icon: 'simple-icons:bitcoin',
    color: '#f7931a',
    ticker: 'BTC',
    address: '1GpZUvhdVkCFxqF4vuaiFxtBTxB3L94vnK',
  },
];

function PlatformCard( { name, icon, color, url, note }: Platform ): ReactNode {
  return(
    <a
      className={styles.card}
      style={{ '--brand': color } as CSSProperties}
      href={url}
      target='_blank'
      rel='noopener noreferrer'
    >
      <span className={styles.icon}><Icon icon={icon} /></span>
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.note}>{note}</span>
      </span>
      <Icon className={styles.arrow} icon='mdi:arrow-top-right' aria-hidden='true' />
    </a>
  )
}

function WalletCard( { name, icon, color, ticker, address }: Wallet ): ReactNode {
  const [copied, setCopied] = useState( false );

  useEffect(() => {
    if( !copied ) return;
    const timer = window.setTimeout( () => setCopied( false ), 2000 );
    return () => window.clearTimeout( timer );
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText( address );
      setCopied( true );
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the address stays selectable.
    }
  };

  return(
    <div className={styles.card} style={{ '--brand': color } as CSSProperties}>
      <span className={styles.icon}><Icon icon={icon} /></span>

      <span className={styles.text}>
        <span className={styles.name}>{name} <small>{ticker}</small></span>
        <code className={styles.address}>{address}</code>
      </span>

      <button
        type='button'
        className={styles.copy}
        onClick={copy}
        aria-label={copied
          ? translate({ id: 'home.donation.copiedLabel', message: '{name} address copied', description: '{name} is a cryptocurrency, e.g. Bitcoin' }, { name })
          : translate({ id: 'home.donation.copyLabel', message: 'Copy {name} address', description: '{name} is a cryptocurrency, e.g. Bitcoin' }, { name })}
      >
        <Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} aria-hidden='true' />
        <span aria-live='polite'>{copied
          ? translate({ id: 'home.donation.copied', message: 'Copied' })
          : translate({ id: 'home.donation.copy', message: 'Copy', description: 'Button that copies a wallet address' })}</span>
      </button>
    </div>
  )
}

export default function Donation(): ReactNode {
  return(
    <section className={styles.section}>
      <div className='container'>
        <h2 className={styles.heading}>
          <Translate id='home.donation.heading' values={{ app: 'Kreate' }}>{'Support {app}'}</Translate>
        </h2>

        <div className={styles.grid}>
          {getPlatforms().map( platform => <PlatformCard key={platform.name} {...platform} /> )}
          {wallets.map( wallet => <WalletCard key={wallet.name} {...wallet} /> )}
        </div>
      </div>
    </section>
  )
}
