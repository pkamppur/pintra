import pg, { PoolClient } from 'pg'
import { getEnv } from './env'

const DATABASE_URL = getEnv('DATABASE_URL')
const NODE_ENV = getEnv('NODE_ENV')

const pgSSL =
  NODE_ENV === 'production'
    ? {
        rejectUnauthorized: false,
      }
    : undefined

const pgConfig = {
  connectionString: DATABASE_URL,
  ssl: pgSSL,
}
const connectionPool = new pg.Pool(pgConfig)
let hasInitialized = false

export async function withDBClient<T>(func: (client: PoolClient) => Promise<T>): Promise<T> {
  if (!hasInitialized) {
    hasInitialized = true

    await _withDBClient(async (client) => {
      await client.query(`
                CREATE TABLE IF NOT EXISTS board (id text PRIMARY KEY, name text NOT NULL);
            `)
      //            ALTER TABLE board ADD COLUMN IF NOT EXISTS content JSONB NOT NULL;
      ///          ALTER TABLE board ADD COLUMN IF NOT EXISTS history JSONB NOT NULL default '[]';
    })
  }
  return _withDBClient(func)
}

async function _withDBClient<T>(func: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await connectionPool.connect()
  try {
    return func(client)
  } finally {
    client.release()
  }
}
