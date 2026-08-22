import { app } from './app.js';
import { ENV } from './config/env.js';

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`🌍 GlobeTrotter Backend Running on Port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`===========================================`);
});
