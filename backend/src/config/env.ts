import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PORT: z.coerce.number().int().positive().default(4300),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
  UPLOAD_DIR: z.string().default('uploads'),
  PUBLIC_UPLOAD_PATH: z.string().default('/uploads'),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(5),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(8).optional(),
  SEED_ADMIN_NAME: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
