import Fastify from 'fastify';

import { closeDatabase } from '../../database/postgres/pool.js';
import { registerHealthRoute } from './routes/health.route.js';

export const buildApp = () => {
  const app = Fastify({ logger: true });

  registerHealthRoute(app);

  app.addHook('onClose', async () => {
    await closeDatabase();
  });

  return app;
};
