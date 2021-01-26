import { Id } from 'shared/board/model'
import { BoardContentGateway, BoardConfig } from 'server/board/boardContentGateway'
import pgBoardContentGateway from 'server/board/pgBoardContentGateway'
import trelloBoardContentGateway from 'server/board/trelloBoardContentGateway'
import { withDB as _withDB } from 'server/db'
import { PoolClient } from 'pg'
import { getEnv } from '../env'
import { createDecipheriv, createCipheriv, randomBytes } from 'crypto'

export async function boardContentGateway(userId: Id, boardId: Id): Promise<BoardContentGateway> {
  const config = await configForBoard(userId, boardId)

  if (config.dataSource === 'trello') {
    return trelloBoardContentGateway(userId, config)
  }
  return pgBoardContentGateway(userId, config)
}

function debugPrintEncryptedValue(value: string) {
  const encrypted = encryptValue(value, getEnv('CONFIG_ENCRYPTION_KEY'), getEnv('CONFIG_ENCRYPTION_IV'))
  console.log(`encrypted: ${encrypted}`)
}

async function configForBoard(userId: Id, boardId: Id): Promise<BoardConfig> {
  const config = await withDB<DbBoardConfig>(async (db) => {
    const result = await db.query('SELECT id, data_source, secrets, options FROM board_configs WHERE id = $1', [
      boardId,
    ])

    if (result.rowCount !== 1) {
      throw new Error(`Unknown board ${boardId}`)
    }

    return result.rows[0]
  })

  let decryptedSecrets: { [key: string]: string } | undefined
  if (config.secrets) {
    decryptedSecrets = {}
    for (const key in config.secrets) {
      const value = config.secrets[key]

      const decrypted = decryptValue(value, getEnv('CONFIG_ENCRYPTION_KEY'), getEnv('CONFIG_ENCRYPTION_IV'))
      decryptedSecrets[key] = decrypted
    }
  } else {
    decryptedSecrets = undefined
  }
  return { id: config.id, dataSource: config.data_source, secrets: decryptedSecrets, options: config.options }
}

function decryptValue(value: string, key: string, iv: string): string {
  const algorithm = 'aes-256-cbc'
  const decipher = createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  const decrypted = Buffer.concat([decipher.update(Buffer.from(value, 'hex')), decipher.final()])

  return decrypted.toString('hex')
}

function encryptValue(value: string, key: string, iv: string): string {
  const algorithm = 'aes-256-cbc'
  const cipher = createCipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  const encrypted = Buffer.concat([cipher.update(Buffer.from(value, 'hex')), cipher.final()])

  return encrypted.toString('hex')
}

let hasInitializedDb = false

async function withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  if (!hasInitializedDb) {
    console.log(`Init BoardConfig Gateway DB`)
    hasInitializedDb = true

    await _withDB(async (db) => {
      try {
        await db.query(`
        CREATE TABLE IF NOT EXISTS board_configs (
          id text PRIMARY KEY,

          data_source text,
          secrets jsonb,
          options jsonb
        );
      `)
      } catch (error) {
        console.log(`BoardConfig init error ${JSON.stringify(error)}`)
      }
    })
  }

  return _withDB(func)
}

interface DbBoardConfig {
  id: string
  data_source: string
  secrets?: { [key: string]: string }
  options?: unknown
}
