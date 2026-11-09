

export default function CustomPathsPlugin(context, options) {
  return {
    name: 'custom-paths-plugin',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            "@components/*": "/src/components/*",
            "@utils/*": "/src/util/*",
            // `$` = exact match: `import { Icon } from '@Iconify'`
            "@Iconify$": "/src/components/Iconify"
          },
        },
      };
    },
  };
}