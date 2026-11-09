import type { ReactNode } from 'react';
import { Icon as IconifyIcon, type IconProps } from '@iconify/react';


/**
 * Drop-in replacement for @iconify/react's `Icon`.
 *
 * Icons are bundled offline (see offline-icons-plugin.js), so `ssr` renders them
 * straight away: they're in the server HTML and don't pop in after hydration.
 */
export function Icon( props: IconProps ): ReactNode {
  return <IconifyIcon ssr {...props} />
}
