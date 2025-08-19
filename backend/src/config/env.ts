import dotenv from 'dotenv';

dotenv.config();

const getEnv = <T>(key: string, defaultValue: T): T => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

const _getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const ENV = {
  PORT: getEnv<number>('PORT', 3000),
  NODE_ENV: getEnv<string>('NODE_ENV', 'development'),

  MONGO_URI: getEnv<string>('MONGO_URI', ''),

  CLERK_PUBLISHABLE_KEY: getEnv<string>('CLERK_PUBLISHABLE_KEY', ''),
  CLERK_SECRET_KEY: getEnv<string>('CLERK_SECRET_KEY', ''),

  ARCJET_ENV: getEnv<string>('ARCJET_ENV', 'development'),
  ARCJET_KEY: getEnv<string>('ARCJET_KEY', ''),

  CLOUDINARY_CLOUD_NAME: getEnv<string>('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: getEnv<string>('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: getEnv<string>('CLOUDINARY_API_SECRET', '')
} as const;
