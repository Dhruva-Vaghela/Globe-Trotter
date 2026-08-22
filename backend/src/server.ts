import http from 'http';
import { app } from './app.js';
import { ENV } from './config/env.js';

const initialPort = Number(ENV.PORT) || 5001;

function startServer(portToUse: number) {
  const server = http.createServer(app);

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToUse} is currently in use by another process. Retrying on port ${portToUse + 1}...`);
      setTimeout(() => {
        startServer(portToUse + 1);
      }, 300);
    } else {
      console.error('❌ Server error:', err);
    }
  });

  server.listen(portToUse, () => {
    console.log(`===========================================`);
    console.log(`🌍 GlobeTrotter Backend Running on Port ${portToUse}`);
    console.log(`📍 Health Check: http://localhost:${portToUse}/api/v1/health`);
    console.log(`===========================================`);
  });
}

startServer(initialPort);
