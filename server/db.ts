import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as fs from "fs";
import { sql } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

function getDatabaseUrl(): string {
  // For production deployments, check /tmp/replitdb first
  try {
    const replitDbPath = '/tmp/replitdb';
    if (fs.existsSync(replitDbPath)) {
      const url = fs.readFileSync(replitDbPath, 'utf-8').trim();
      if (url) {
        console.log('Using database URL from /tmp/replitdb');
        return url;
      }
    }
  } catch (e) {
    // Ignore errors reading the file
  }

  // Fall back to environment variable
  if (process.env.DATABASE_URL) {
    console.log('Using database URL from environment variable');
    return process.env.DATABASE_URL;
  }

  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = getDatabaseUrl();
export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });

export async function ensureTablesExist() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Database tables verified/created');
  } catch (error) {
    console.error('Error ensuring tables exist:', error);
  }
}
