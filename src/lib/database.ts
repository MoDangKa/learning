import { loadEnvConfig } from "@next/env";
import pg, { Pool, PoolConfig } from "pg";
import { z } from "zod";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const envSchema = z.object({
  POSTGRES_URL: z.string().optional(),
  POSTGRES_HOST: z.string().min(1).optional(),
  POSTGRES_PORT: z.string().min(1).optional(),
  POSTGRES_DATABASE: z.string().min(1).optional(),
  POSTGRES_USER: z.string().min(1).optional(),
  POSTGRES_PASSWORD: z.string().min(1).optional(),
  POSTGRES_MAX_CONNECTIONS: z
    .string()
    .regex(/^\d+$/)
    .default("10")
    .transform(Number),
  POSTGRES_IDLE_TIMEOUT_MS: z
    .string()
    .regex(/^\d+$/)
    .default("30000")
    .transform(Number),
  POSTGRES_CONNECTION_TIMEOUT_MS: z
    .string()
    .regex(/^\d+$/)
    .default("2000")
    .transform(Number),
});

const env = envSchema.parse(process.env);

let pool: Pool | null = null;

function getPoolConfig(): PoolConfig {
  if (env.POSTGRES_URL) {
    return {
      connectionString: env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
      max: env.POSTGRES_MAX_CONNECTIONS,
      idleTimeoutMillis: env.POSTGRES_IDLE_TIMEOUT_MS,
      connectionTimeoutMillis: env.POSTGRES_CONNECTION_TIMEOUT_MS,
    };
  }

  return {
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT || "5432"),
    database: env.POSTGRES_DATABASE,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    max: env.POSTGRES_MAX_CONNECTIONS,
    idleTimeoutMillis: env.POSTGRES_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: env.POSTGRES_CONNECTION_TIMEOUT_MS,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  };
}

function initializePool() {
  if (!pool) {
    const config = getPoolConfig();
    pool = new pg.Pool(config);

    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }
  return pool;
}

initializePool();

export async function getClient(): Promise<pg.PoolClient> {
  const client = await pool!.connect();

  try {
    await client.query("SELECT 1");
  } catch (err: unknown) {
    console.error("err: ", err);
    client.release();
    throw new Error("Failed to verify database connection");
  }

  return client;
}

export async function query(
  sql: string,
  params?: unknown[],
  client?: pg.PoolClient
) {
  const shouldRelease = !client;
  client = client || (await getClient());

  try {
    const start = Date.now();
    const result = await client.query(sql, params);
    const duration = Date.now() - start;
    console.log(`Executed query in ${duration}ms: ${sql}`);
    return result;
  } catch (error) {
    console.error("Query error:", error);
    throw new DatabaseError(
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : "Unknown database error",
      sql,
      params
    );
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

export class DatabaseError extends Error {
  constructor(
    public message: string,
    public sql?: string,
    public params?: unknown[]
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

process.on("exit", () => {
  if (pool) {
    pool.end();
  }
});
