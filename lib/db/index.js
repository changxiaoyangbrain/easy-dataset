import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Normalize SQLite path to an absolute location so restarts/build output (e.g. .next/standalone)
// don't accidentally point Prisma to a fresh file.
if (process.env.DATABASE_URL?.startsWith('file:')) {
  const dbFile = process.env.DATABASE_URL.replace('file:', '');
  if (!path.isAbsolute(dbFile)) {
    const resolved = path.resolve(process.cwd(), dbFile);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    process.env.DATABASE_URL = `file:${resolved}`;
  }
}

const createPrismaClient = () =>
  new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    log: ['error']
  });

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
