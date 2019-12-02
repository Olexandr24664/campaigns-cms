import dotenv from 'dotenv';
dotenv.config();

export const PORT = parseInt(process.env.PORT || '9999');
export const HOST = process.env.HOST || '127.0.0.1';
export const MONGO_LOCAL_CONNECTION_STRING =
  process.env.MONGO_LOCAL_CONNECTION_STRING ||
  'mongodb://localhost:27017/campaigns';
export const MONGO_CLOUD_CONNECTION_STRING =
  process.env.MONGO_CLOUD_CONNECTION_STRING || '';
export const CLOUD_DB = process.env.CLOUD_DB || 'false';
export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || 'env has no client id';
export const GOOGLE_CLIENT_SECRETE =
  process.env.GOOGLE_CLIENT_SECRETE || 'env has no secrete id';
export const CMSSSTARTER_APP_URL =
  process.env.CMSSSTARTER_APP_URL || 'http://localhost:80';

export const jwtSecret = process.env.JWT_SECRET || '';
