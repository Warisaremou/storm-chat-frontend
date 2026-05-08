import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://storm-chat.local';

  const proxyCommon = {
    target: devProxyTarget,
    changeOrigin: true,
    cookieDomainRewrite: { 'storm-chat.local': '' } as Record<string, string>,
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        // WebSocket — use http target + ws:true so the upgrade works reliably (ws:// target can fail in Firefox).
        // Must come before the /api entry (more specific path wins).
        '/api/messages/ws': {
          ...proxyCommon,
          ws: true,
        },
        '/api': proxyCommon,
      },
    },
  };
});
