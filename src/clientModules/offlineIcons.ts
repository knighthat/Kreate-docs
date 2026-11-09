/**
 * Registers the icons bundled by offline-icons-plugin.js with @iconify/react.
 * Client modules load before the first render, on the server too, so icons
 * render straight into the HTML without any request to api.iconify.design.
 */
import { addCollection } from '@iconify/react';
import collections from '@generated/offline-icons-plugin/default/icons.json';

for( const collection of collections )
  addCollection( collection );
