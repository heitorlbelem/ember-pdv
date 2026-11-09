import { Pool, type PoolConfig, type QueryResultRow } from 'pg';

import { env } from '../../config/env.js';

const poolConfig: PoolConfig = env.database.url
  ? { connectionString: env.database.url }
  : {
      host: env.database.host,
      port: env.database.port,
      database: env.database.name,
      user: env.database.user,
      password: env.database.password,
    };

if (env.database.ssl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

export const pool = new Pool({
  ...poolConfig,
  max: env.database.poolMax,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL client error', error);
});

export const query = <Result extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: unknown[],
) => pool.query<Result>(text, values);

export const closeDatabase = (): Promise<void> => pool.end();
