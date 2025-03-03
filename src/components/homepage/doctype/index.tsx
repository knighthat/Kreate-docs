import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link'


type DocumentType = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  to: string
};
  
const types: DocumentType[] = [
  {
    title: 'I\'m a developer',
    Svg: require('@site/static/img/developer-doctype-transparent.svg').default,
    to: '/docs/dev/'
  },
  {
    title: 'I\'m a user',
    Svg: require('@site/static/img/user-doctype-transparent.svg').default,
    to: '/docs/usr/'
  }
]

function DocType({title, Svg, to}: DocumentType) {
  return (
    <Link to={to} className={clsx('col col--5', styles.noHyperlinkDecoration)}>
      <div className={styles.box}>
        <div className="text--center">
          <Svg className={styles.typeSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
        </div>
      </div>
    </Link>
  );
}

export default function HomepageDoctype(): ReactNode {
    return (
        <section className={styles.types}>
          <div className="container">
            <div className={clsx('row', styles.centeredFlexbox)}>
              {types.map((props, idx) => (
                <DocType key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      );
}