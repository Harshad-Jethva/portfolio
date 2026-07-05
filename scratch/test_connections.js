import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const targets = [
  { name: "Env DATABASE_URL", url: process.env.DATABASE_URL },
  { name: "Env DIRECT_URL", url: process.env.DIRECT_URL },
  { name: "Local Portfolio Database", url: "postgres://postgres:postgres@localhost:5432/portfolio" },
  { name: "Local Default Postgres Database", url: "postgres://postgres:postgres@localhost:5432/postgres" }
];

async function testConnection(target) {
  if (!target.url) {
    console.log(`[${target.name}] No connection string configured.`);
    return null;
  }
  
  console.log(`[${target.name}] Testing connection...`);
  const pool = new Pool({
    connectionString: target.url,
    ssl: target.url.includes("supabase.com") || target.url.includes("pooler.supabase.com") ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 5000,
  });

  try {
    const res = await pool.query("SELECT NOW();");
    console.log(`[${target.name}] SUCCESS! Current time from DB:`, res.rows[0].now);
    return target.url;
  } catch (err) {
    console.error(`[${target.name}] FAILED:`, err.message);
    return null;
  } finally {
    await pool.end();
  }
}

async function run() {
  for (const target of targets) {
    const successUrl = await testConnection(target);
    if (successUrl) {
      console.log(`\nFound working database connection: ${target.name}`);
      process.exit(0);
    }
  }
  console.log("\nNo working database connections found.");
  process.exit(1);
}

run();
