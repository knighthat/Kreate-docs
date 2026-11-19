// Adapted from React Bits "BranchedMenu" (https://reactbits.dev), ported to TypeScript and made recursive:
// sections can nest to any depth, rows can be links, and branch positions are measured from the DOM so
// rows may wrap or contain open sub-sections. Colours default to Infima variables (follows light/dark).

import {
  createContext,
  isValidElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import './styles.css';

export interface BranchedMenuNode {
  label: string;
  /** Unique across the whole tree. Falls back to `href`, then `label`. */
  value?: string;
  /** Renders the row as a link. On a section, clicking navigates and opens it; clicking again folds it. */
  href?: string;
  /** A Hugeicons icon object, or any React element. */
  icon?: IconSvgElement | ReactElement;
  /** A node with children is a foldable section. Sections may nest. */
  children?: BranchedMenuNode[];
}

export interface BranchedMenuLinkProps {
  href: string;
  className: string;
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  'aria-current'?: 'page';
  'aria-expanded'?: boolean;
  'data-active'?: '';
  'data-path'?: '';
  'data-open'?: '';
}

export interface BranchedMenuProps {
  items: BranchedMenuNode[];
  /** Controlled selected value. Omit to let the menu track selection itself. */
  active?: string;
  /** Initial selected value when uncontrolled. */
  defaultActive?: string;
  /** Section values open at first. Ancestors of the active node are always opened. */
  defaultOpen?: string[];
  onSelect?: (value: string, node: BranchedMenuNode) => void;
  onToggle?: (value: string, open: boolean) => void;
  /** Renders link rows. Defaults to a plain <a>; pass your router's Link for client-side navigation. */
  renderLink?: (props: BranchedMenuLinkProps) => ReactElement;
  /** Root element. Use 'div' when the menu already sits inside a <nav>. */
  as?: 'nav' | 'div';
  color?: string;
  accentColor?: string;
  /** A solid colour, so joints never darken. */
  lineColor?: string;
  width?: number;
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  fontSize?: number;
  drawDuration?: number;
  foldDuration?: number;
  className?: string;
}

const PAD = 6;
const MARK = 16;

const keyOf = (n: BranchedMenuNode) => n.value ?? n.href ?? n.label;
const hasKids = (n: BranchedMenuNode) => Boolean(n.children?.length);
const defaultLink = (p: BranchedMenuLinkProps) => <a {...p} />;
const renderIcon = (icon: IconSvgElement | ReactElement) =>
  isValidElement(icon) ? icon : <HugeiconsIcon icon={icon as IconSvgElement} size={16} strokeWidth={1.8} />;

/** Maps every node's value to the values of its ancestor sections, root first. */
function indexAncestors(items: BranchedMenuNode[]) {
  const map = new Map<string, string[]>();
  const walk = (nodes: BranchedMenuNode[], chain: string[]) => {
    for (const n of nodes) {
      const v = keyOf(n);
      map.set(v, chain);
      if (n.children) walk(n.children, [...chain, v]);
    }
  };
  walk(items, []);
  return map;
}

interface Ctx {
  active: string;
  onPath: Set<string>;
  open: Set<string>;
  activate: (node: BranchedMenuNode, e?: MouseEvent) => void;
  renderLink: (props: BranchedMenuLinkProps) => ReactElement;
  rowHeight: number;
  indent: number;
  trunk: number;
  radius: number;
}

const MenuContext = createContext<Ctx | null>(null);
const useMenu = () => useContext(MenuContext)!;

export default function BranchedMenu({
  items,
  active: activeProp,
  defaultActive = '',
  defaultOpen = [],
  onSelect,
  onToggle,
  renderLink = defaultLink,
  as: Root = 'nav',
  color = 'var(--ifm-font-color-base)',
  accentColor = 'var(--ifm-color-primary)',
  lineColor = 'var(--ifm-color-emphasis-300)',
  width = 240,
  rowHeight = 36,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 14,
  drawDuration = 400,
  foldDuration = 300,
  className = '',
}: BranchedMenuProps) {
  const ancestors = useMemo(() => indexAncestors(items), [items]);
  const [innerActive, setInnerActive] = useState(defaultActive);
  const active = activeProp ?? innerActive;

  const [open, setOpen] = useState(() => new Set([...defaultOpen, ...(ancestors.get(active) ?? [])]));
  // When the active node changes (e.g. the user navigated), unfold the sections leading to it.
  const [seenActive, setSeenActive] = useState(active);
  if (active !== seenActive) {
    setSeenActive(active);
    const chain = ancestors.get(active) ?? [];
    if (chain.some((v) => !open.has(v))) setOpen((prev) => new Set([...prev, ...chain]));
  }

  const onPath = useMemo(
    () => new Set(ancestors.has(active) ? [...ancestors.get(active)!, active] : []),
    [ancestors, active],
  );

  const latest = useRef({ onSelect, onToggle });
  latest.current = { onSelect, onToggle };

  const setSection = (v: string, next?: boolean) => {
    const isOpen = next ?? !open.has(v);
    if (isOpen === open.has(v)) return;
    setOpen((prev) => {
      const s = new Set(prev);
      if (isOpen) s.add(v);
      else s.delete(v);
      return s;
    });
    latest.current.onToggle?.(v, isOpen);
  };

  const select = (v: string, node: BranchedMenuNode) => {
    setInnerActive(v);
    latest.current.onSelect?.(v, node);
  };

  const activate = (node: BranchedMenuNode, e?: MouseEvent) => {
    const v = keyOf(node);
    if (!hasKids(node)) return select(v, node);
    if (node.href && v !== active) {
      setSection(v, true);
      return select(v, node);
    }
    e?.preventDefault();
    setSection(v);
  };

  // Marker on the left rail, beside the top-level row that leads to the active node.
  const navRef = useRef<HTMLElement & HTMLDivElement>(null);
  const tops = useRef<(HTMLDivElement | null)[]>([]);
  const markerRef = useRef<HTMLSpanElement>(null);
  const markerIndex = items.findIndex((n) => onPath.has(keyOf(n)));
  const markerShown = markerIndex >= 0 && (!hasKids(items[markerIndex]) || open.has(keyOf(items[markerIndex])));

  useLayoutEffect(() => {
    const place = (glide: boolean) => {
      const m = markerRef.current;
      const el = tops.current[markerIndex];
      if (!m) return;
      const on = markerShown && el;
      if (!glide) m.style.transition = 'none';
      if (on) m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`;
      m.toggleAttribute('data-on', Boolean(on));
      if (!glide) {
        void m.offsetHeight;
        m.style.transition = '';
      }
    };
    place(true);
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      place(false);
    });
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [markerIndex, markerShown, items, fontSize, rowHeight]);

  const style = {
    '--bm-w': `${width}px`,
    '--bm-ink': color,
    '--bm-accent': accentColor,
    '--bm-line': lineColor,
    '--bm-font': `${fontSize}px`,
    '--bm-row': `${rowHeight}px`,
    '--bm-indent': `${indent}px`,
    '--bm-line-w': lineWidth,
    '--bm-draw': `${drawDuration}ms`,
    '--bm-fold': `${foldDuration}ms`,
  } as CSSProperties;

  const ctx: Ctx = { active, onPath, open, activate, renderLink, rowHeight, indent, trunk, radius };

  return (
    <MenuContext.Provider value={ctx}>
      <Root ref={navRef} className={`branched-menu${className ? ` ${className}` : ''}`} style={style}>
        <span ref={markerRef} className="branched-menu__marker" aria-hidden="true" />
        {items.map((node, i) => {
          const isOpen = hasKids(node) && open.has(keyOf(node));
          return (
            <div key={keyOf(node)} className="branched-menu__section">
              <div
                ref={(el) => {
                  tops.current[i] = el;
                }}
                className="branched-menu__row"
              >
                <Head node={node} variant="head" />
              </div>
              {hasKids(node) ? (
                <Fold open={isOpen}>
                  <Tree nodes={node.children!} open={isOpen} />
                </Fold>
              ) : null}
            </div>
          );
        })}
      </Root>
    </MenuContext.Provider>
  );
}

function Head({ node, variant }: { node: BranchedMenuNode; variant: 'head' | 'item' }) {
  const { active, onPath, open, activate, renderLink } = useMenu();
  const v = keyOf(node);
  const kids = hasKids(node);
  const isOpen = kids && open.has(v);
  const isActive = v === active;
  const common = {
    className: `branched-menu__${variant}`,
    'aria-expanded': kids ? isOpen : undefined,
    'data-active': isActive ? ('' as const) : undefined,
    'data-path': onPath.has(v) ? ('' as const) : undefined,
    'data-open': isOpen ? ('' as const) : undefined,
  };
  const content = (
    <>
      {node.icon ? (
        <span className="branched-menu__icon" aria-hidden="true">
          {renderIcon(node.icon)}
        </span>
      ) : null}
      <span className="branched-menu__label">{node.label}</span>
      {kids ? (
        <svg className="branched-menu__chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M3.5 2 L6.5 5 L3.5 8" />
        </svg>
      ) : null}
    </>
  );

  if (node.href) {
    return renderLink({
      ...common,
      href: node.href,
      'aria-current': isActive ? 'page' : undefined,
      onClick: (e) => {
        // Let the browser handle new-tab / new-window clicks untouched.
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        activate(node, e);
      },
      children: content,
    });
  }
  return (
    <button type="button" {...common} aria-current={isActive ? 'true' : undefined} onClick={(e) => activate(node, e)}>
      {content}
    </button>
  );
}

function Fold({ open, nested = false, children }: { open: boolean; nested?: boolean; children: ReactNode }) {
  return (
    <div
      className={`branched-menu__body${nested ? ' branched-menu__body--nested' : ''}`}
      data-open={open ? '' : undefined}
      inert={!open}
    >
      <div className="branched-menu__fold">{children}</div>
    </div>
  );
}

function Tree({ nodes, open }: { nodes: BranchedMenuNode[]; open: boolean }) {
  const { onPath, open: openSet } = useMenu();
  const reachIndex = nodes.findIndex((n) => onPath.has(keyOf(n)));

  return (
    <div className="branched-menu__tree">
      <Lines count={nodes.length} reachIndex={reachIndex} open={open} />
      {nodes.map((node) => {
        if (!hasKids(node)) {
          return (
            <div key={keyOf(node)} className="branched-menu__row">
              <Head node={node} variant="item" />
            </div>
          );
        }
        const isOpen = openSet.has(keyOf(node));
        return (
          <div key={keyOf(node)} className="branched-menu__nested">
            <div className="branched-menu__row">
              <Head node={node} variant="item" />
            </div>
            <Fold open={isOpen} nested>
              <Tree nodes={node.children!} open={isOpen} />
            </Fold>
          </div>
        );
      })}
    </div>
  );
}

// This tree's own rows: leaf rows, and the header row of each nested section (not rows deeper down).
const ROWS = ':scope > .branched-menu__row, :scope > .branched-menu__nested > .branched-menu__row';

/**
 * The trunk and branches for one tree. Row centres are measured, so rows may wrap or hold open
 * sub-sections. pathLength=1 keeps the accent's draw animation correct while lengths change.
 *
 * Measures from its own <svg> (whose parent is the tree) rather than from refs owned by Tree: a parent's
 * ref is attached only after its children's layout effects run, so a Tree ref would still be null here.
 */
function Lines({ count, reachIndex, open }: { count: number; reachIndex: number; open: boolean }) {
  const { rowHeight, indent, trunk, radius } = useMenu();
  const svgRef = useRef<SVGSVGElement>(null);
  // Fixed-height estimate for the server render; replaced by measurements before first paint.
  const [ys, setYs] = useState(() => Array.from({ length: count }, (_, k) => PAD + k * rowHeight + rowHeight / 2));
  const [height, setHeight] = useState(PAD * 2 + count * rowHeight);

  useLayoutEffect(() => {
    const tree = svgRef.current?.parentElement;
    if (!tree) return;
    const measure = () => {
      const top = tree.getBoundingClientRect().top;
      const next = Array.from(tree.querySelectorAll<HTMLElement>(ROWS), (el) => {
        const r = el.getBoundingClientRect();
        return r.top - top + r.height / 2;
      });
      setYs((prev) =>
        prev.length === next.length && prev.every((y, i) => Math.abs(y - next[i]) < 0.5) ? prev : next,
      );
      setHeight(tree.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tree);
    return () => ro.disconnect();
  }, [count, rowHeight]);

  if (!ys.length) return null;
  const r = Math.min(radius, rowHeight / 2 - 2);
  const endX = indent - 8;
  const branch = (y: number) => `M ${trunk} ${y - r} A ${r} ${r} 0 0 0 ${trunk + r} ${y} H ${endX}`;
  const reach = (y: number) => `M ${trunk} 0 V ${y - r} A ${r} ${r} 0 0 0 ${trunk + r} ${y} H ${endX}`;

  return (
    <svg
      ref={svgRef}
      className="branched-menu__lines"
      width={indent}
      height={height}
      data-open={open ? '' : undefined}
      aria-hidden="true"
    >
      <path className="branched-menu__base" d={`M ${trunk} 0 V ${ys[ys.length - 1] - r}`} />
      {ys.map((y, k) => (
        <path key={`b${k}`} className="branched-menu__base" d={branch(y)} />
      ))}
      {ys.map((y, k) => (
        <path
          key={`r${k}`}
          className="branched-menu__reach"
          d={reach(y)}
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: k === reachIndex ? 0 : 1 }}
        />
      ))}
    </svg>
  );
}
