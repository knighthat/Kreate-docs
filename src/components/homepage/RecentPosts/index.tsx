import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';

import styles from './styles.module.css';


type Post = {
  title: string
  permalink: string
  date: string
  description: string
  image: string | null
  readingTime: number | null
};

const dateFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

function PostCard( { title, permalink, date, description, image, readingTime }: Post ): ReactNode {
  return(
    <li className={styles.item}>
      <Link to={permalink} className={styles.card}>
        <div className={styles.cover}>
          {image && <img src={image} alt='' loading='lazy' />}
        </div>

        <div className={styles.content}>
          <p className={styles.meta}>
            <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
            {readingTime && <> · {Math.ceil(readingTime)} min read</>}
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
          <h2 className={styles.heading}>Recent posts</h2>
          <Link className={styles.all} to='/blog'>
            View all <span aria-hidden='true'>→</span>
          </Link>
        </div>

        <ul className={styles.list}>
          {posts.map( post => <PostCard key={post.permalink} {...post} /> )}
        </ul>
      </div>
    </section>
  )
}
