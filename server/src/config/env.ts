// server/src/config/env.ts
import path from 'path';
import dotenv from 'dotenv';

// Carga .env desde la raíz del backend: server/.env
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Helper para fallar con mensaje claro si falta una var
function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`❌ Falta variable de entorno ${name}. Revisa server/.env`);
    process.exit(1);
  }
  return v;
}

export const env = {
  mongoUri: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  port: Number(process.env.PORT || 4000)
};
