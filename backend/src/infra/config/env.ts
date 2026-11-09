import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env.local' });

const envSchema = z.object({
  HOST: z.string().min(1).default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  DATABASE_URL: z.string().min(1).url().optional(),
  POSTGRES_HOST: z.string().min(1).default('localhost'),
  POSTGRES_PORT: z.coerce.number().int().min(1).max(65_535).default(5432),
  POSTGRES_DB: z.string().min(1).default('ember_pdv'),
  POSTGRES_USER: z.string().min(1).default('ember_pdv'),
  POSTGRES_PASSWORD: z.string().min(1).default('ember_pdv_dev'),
  DATABASE_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).default(10),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  host: parsedEnv.HOST,
  port: parsedEnv.PORT,
  database: {
    url: parsedEnv.DATABASE_URL,
    host: parsedEnv.POSTGRES_HOST,
    port: parsedEnv.POSTGRES_PORT,
    name: parsedEnv.POSTGRES_DB,
    user: parsedEnv.POSTGRES_USER,
    password: parsedEnv.POSTGRES_PASSWORD,
    ssl: parsedEnv.DATABASE_SSL,
    poolMax: parsedEnv.DATABASE_POOL_MAX,
  },
};
