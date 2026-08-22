import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
}

export const ENV = {
  PORT: process.env.PORT || '5001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'globetrotter_jwt_super_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'diws',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '893151782982786',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'zhN6g5rUdntT7nVy3kkjfTiKBsE',
};
