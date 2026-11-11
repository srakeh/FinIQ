import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  let connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn("⚠️ DATABASE_URL is not set. Prisma will run without database connection.");
    return new PrismaClient();
  }

  // Sanitize: strip surrounding quotes if accidentally pasted in Vercel UI
  connectionString = connectionString.trim().replace(/^["']|["']$/g, '');

  // Strip sslmode from the URL so pg-connection-string does not overwrite rejectUnauthorized: false with {}
  try {
    const url = new URL(connectionString);
    url.searchParams.delete('sslmode');
    connectionString = url.toString();
  } catch (e) {
    // If connectionString is not a valid URL for URL parser, proceed as-is
  }

  // Ensure SSL is configured for Supabase pooler with self-signed cert support
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;