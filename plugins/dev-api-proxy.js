/**
 * Dev-only: forwards `/api/*` to the deployed site so pages that call the API
 * (e.g. /verify → /api/verify) work under `docusaurus start`.
 *
 * Production builds ignore `devServer`, so this has no effect outside the dev server.
 * Override the target with the `API_PROXY_TARGET` environment variable.
 */
export default function DevApiProxyPlugin(context, options) {
  const target = process.env.API_PROXY_TARGET || options?.target || context.siteConfig.url;

  return {
    name: 'dev-api-proxy-plugin',
    configureWebpack(_config, isServer) {
      if (isServer) return {};
      return {
        devServer: {
          proxy: [
            {
              context: ['/api'],
              target,
              changeOrigin: true,
              secure: true,
            },
          ],
        },
      };
    },
  };
}
