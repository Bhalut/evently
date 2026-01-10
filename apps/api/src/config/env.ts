import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const envSchema = z.object({
  PORT: z.coerce.number().min(1000).default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(8),
  CORS_ORIGIN: z.string().default('*'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    z.flattenError(_env.error).fieldErrors,
  );
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
