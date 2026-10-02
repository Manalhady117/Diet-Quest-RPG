import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createServerApp } from './server/server.js';

async function start() {
  const app = createServerApp();
  const httpServer = http.createServer(app);
  const PORT = 3000;

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false, // Explicitly disable WebSocket HMR to eliminate "WebSocket closed without opened" errors
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use((await import('express')).default.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Diet Quest] Master server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Diet Quest] Server failed to start:', err);
  process.exit(1);
});
