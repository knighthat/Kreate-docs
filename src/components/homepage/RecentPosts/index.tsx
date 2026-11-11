import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';

import styles from './styles.module.css';


type Post = {
  title: string
  permalink: string
  date: string
  description: string
  image: string | null
  readingTime: number | null
};

function PostCard( { title, permalink, date, description, image, readingTime }: Post ): ReactNode {
  const { i18n } = useDocusaurusContext();
  const dateFormat = new Intl.DateTimeFormat(i18n.currentLocale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

  return(
    <li className={styles.item}>
      <Link to={permalink} className={styles.card}>
        <div className={styles.cover}>
          {image && <img src={image} alt='' loading='lazy' />}
        </div>

        <div className={styles.content}>
          <p className={styles.meta}>
            <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
            {readingTime && <> · <Translate id='home.posts.readingTime' values={{ minutes: Math.ceil(readingTime) }}>{'{minutes} min read'}</Translate></>}
          </p>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </Link>
    </li>
  )
}

export default function RecentPosts(): ReactNode {
  const { posts } = usePluginData('recent-posts-plugin') as { posts: Post[] };

  if( !posts.length )
    return null

  return(
    <section className={styles.section}>
      <div className='container'>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            <Translate id='home.posts.heading'>Recent posts</Translate>
          </h2>
          <Link className={styles.all} to='/blog'>
            <Translate id='home.posts.viewAll'>View all</Translate> <span aria-hidden='true'>→</span>
          </Link>
        </div>

        <ul className={styles.list}>
          {posts.map( post => <PostCard key={post.permalink} {...post} /> )}
        </ul>
      </div>
    </section>
  )
}
