/**
 * Swizzled (ejected) from @docusaurus/theme-classic 3.10.2.
 * Renders the desktop docs sidebar with BranchedMenu instead of the stock DocSidebarItems.
 * The mobile sidebar (navbar drawer) is untouched.
 */

import React, { useMemo, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { isSamePath, useAnnouncementBar, useScrollPosition } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/DocSidebar/Desktop/Content';
import BranchedMenu, { type BranchedMenuLinkProps, type BranchedMenuNode } from '@site/src/components/BranchedMenu';

import { CATEGORY_ICONS, DOC_ICONS } from './icons';
import styles from './styles.module.css';

function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);

  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}

// @docusaurus/plugin-content-docs isn't a direct dependency (pnpm won't resolve it from src/), so the
// item type comes from the theme's Props instead.
type PropSidebarItem = Props['sidebar'][number];

/**
 * Converts Docusaurus sidebar items into BranchedMenu nodes, applying the same visibility rules as the
 * stock sidebar (`useVisibleSidebarItems`): unlisted docs show only while open, empty categories drop out.
 * Links are keyed by href; categories by href when they have an index page, else by their label path.
 * `html` items have no BranchedMenu equivalent and are skipped.
 */
function toNodes(items: readonly PropSidebarItem[], path: string, parent: string, expanded: string[]): BranchedMenuNode[] {
  return items.flatMap((item): BranchedMenuNode[] => {
    if (item.type === 'link') {
      if (item.unlisted && !isSamePath(item.href, path)) return [];
      const icon = item.docId ? DOC_ICONS[item.docId] : undefined;
      return [{ value: item.href, label: item.label, href: item.href, icon }];
    }
    if (item.type === 'category') {
      const href = item.href && (!item.linkUnlisted || isSamePath(item.href, path)) ? item.href : undefined;
      const value = href ?? `${parent}/${item.label}`;
      const children = toNodes(item.items, path, value, expanded);
      if (!children.length && !href) return [];
      if (!item.collapsed) expanded.push(value);
      return [{ value, label: item.label, href, icon: CATEGORY_ICONS[item.label], children }];
    }
    return [];
  });
}

/** Value of the deepest node whose href is the current page, or '' when the page isn't in the sidebar. */
function findActive(nodes: BranchedMenuNode[], path: string): string {
  for (const node of nodes) {
    if (node.children) {
      const inner = findActive(node.children, path);
      if (inner) return inner;
    }
    if (node.href && isSamePath(node.href, path)) return node.value!;
  }
  return '';
}

const renderLink = ({ href, ...rest }: BranchedMenuLinkProps) => <Link to={href} {...rest} />;

export default function DocSidebarDesktopContent({ path, sidebar, className }: Props): ReactNode {
  const showAnnouncementBar = useShowAnnouncementBar();
  const { nodes, expanded } = useMemo(() => {
    const expanded: string[] = [];
    return { nodes: toNodes(sidebar, path, '#', expanded), expanded };
  }, [sidebar, path]);
  const active = findActive(nodes, path);

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx(
        'menu thin-scrollbar',
        styles.menu,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
        className,
      )}
    >
      <BranchedMenu
        as="div"
        className={clsx(ThemeClassNames.docs.docSidebarMenu, styles.branchedMenu)}
        items={nodes}
        active={active}
        defaultOpen={expanded}
        renderLink={renderLink}
      />
    </nav>
  );
}
