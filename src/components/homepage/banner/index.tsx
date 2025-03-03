import React from 'react';
import styles from './styles.module.css';

const Gallery = () => {
  return (
    <div className={styles.gallery}>
      <img src="/img/screenshot_left.webp" alt="Left" className={`${styles.image} ${styles.side} ${styles.left}`} />
      <img src="/img/screenshot_main.webp" alt="Main" className={`${styles.image} ${styles.main}`} />
      <img src="/img/screenshot_right.webp" alt="Right" className={`${styles.image} ${styles.side} ${styles.right}`} />
    </div>
  );
};

export default Gallery;