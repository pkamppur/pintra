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

export async function withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  if (!hasInitialized) {
    hasInitialized = true
  }
  return _withDB(func)
}

async function _withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  const db = await connectionPool.connect()
  try {
    return func(db)
  } finally {
    db.release()
  }
}
