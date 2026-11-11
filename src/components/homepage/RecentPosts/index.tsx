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

/** Last card of a row, linking to the full list. */
function SeeMoreCard( { to }: { to: string } ): ReactNode {
  return(
    <li className={styles.item}>
      <Link to={to} className={`${styles.card} ${styles.more}`}>
        <span className={styles.moreArrow} aria-hidden='true'>→</span>
        <Translate id='home.posts.seeMore'>See more</Translate>
      </Link>
    </li>
  )
}

/** One horizontally scrolling row, ending with a "See more" card. */
function Row( { posts, more }: { posts: Post[], more: string } ): ReactNode {
  if( !posts.length )
    return null

  return(
    <ul className={styles.list}>
      {posts.map( post => <PostCard key={post.permalink} {...post} /> )}
      <SeeMoreCard to={more} />
    </ul>
  )
}

export default function RecentPosts(): ReactNode {
  const { posts, releases } = usePluginData('recent-posts-plugin') as { posts: Post[], releases: Post[] };

  if( !posts.length && !releases.length )
    return null

  return(
    <section className={styles.section}>
      <div className='container'>
        <h2 className={styles.heading}>
          <Translate id='home.posts.heading'>Recent posts</Translate>
        </h2>

        {/* First row: blog posts. Second row: releases, each scrolling on its own. */}
        <Row posts={posts} more='/blog' />
        <Row posts={releases} more='/releases' />
      </div>
    </section>
  )
}
