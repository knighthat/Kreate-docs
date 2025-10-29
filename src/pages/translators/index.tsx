import React, { type ReactNode } from 'react';

import rawJson from './translators.json';
import styles from './styles.module.css';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';


interface User {
  name: string
  avatar: string
  joined: string
}

interface Language {
  id: string
  name: string
}

interface Translator {
  user: User
  languages: Language[]
  translated: number
}

function RenderUser({ name, avatar }: User): ReactNode {
  return (
    <div className={styles.userCell}>
      {/* Only here to make sure the size is consistent */}
      <div className={clsx('visibility--none padding-left--sm', styles.userNameFont)}>{name}</div>

      <div className={styles.avatarContainer}>
        <img src={avatar} alt={`${name} avatar`} className={styles.avatarImage} />
      </div>

      <div className={clsx(styles.userName, styles.userNameFont, 'padding-left--sm')}>{name}</div>
    </div>
  )
}

function RenderLanguage({ name }: Language): ReactNode {
  return (
    <div className={clsx('row', styles.centerCell)}>
      <div className='col'>{name}</div>
    </div>
  )
}

function TranslatorsTable(): ReactNode {

  return (
    <table className='container'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Translated (words)</th>
          <th>Languages</th>
          <th>Member since</th>
        </tr>
      </thead>
      <tbody>
        {
          (rawJson as Translator[]).map(t => (
            <tr>
              <td className={clsx(styles.userSlot, 'padding--none')}>
                <RenderUser name={t.user.name} avatar={t.user.avatar} joined={t.user.joined} />
              </td>

              <td className={styles.centerCell}>
                {t.translated}
              </td>

              <td className='padding-horiz--lg'>
                {t.languages.map(RenderLanguage)}
              </td>

              <td className='padding--md'>
                <div className={styles.joinDate}>
                  {t.user.joined}
                </div>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default function Translators(): ReactNode {
  return (
    <Layout
      title='Translators'
      description='Turning English into your native language'>
      <main className='padding-vert--xl'>
        <BrowserOnly>
          {() => <TranslatorsTable />}
        </BrowserOnly>
      </main>
    </Layout>
  )
}