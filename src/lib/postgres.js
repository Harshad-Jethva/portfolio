import { Pool } from "pg";

let pool;
let schemaPromise;

const createPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Add it to your environment (for example, .env.local)."
    );
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 5000,
  });
};

export function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export async function query(text, values = []) {
  return getPool().query(text, values);
}

export async function withTransaction(run) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await run(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function getSchemaPromise() {
  return schemaPromise;
}

export function setSchemaPromise(nextPromise) {
  schemaPromise = nextPromise;
}
