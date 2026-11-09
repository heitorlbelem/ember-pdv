import type { FastifyInstance } from 'fastify';

import { query } from '../../../database/postgres/pool.js';

export const registerHealthRoute = (app: FastifyInstance): void => {
  app.get('/health', async (_request, reply) => {
    try {
      await query('SELECT 1');
      return { status: 'ok', database: 'ok' };
    } catch (error) {
      app.log.error(error, 'Database health check failed');
      return reply.code(503).send({ status: 'error', database: 'unavailable' });
    }
  });
};
