import { Id } from 'shared/board/model'
import { BoardContentGateway, BoardConfig } from 'server/board/boardContentGateway'
import pgBoardContentGateway from 'server/board/pgBoardContentGateway'
import trelloBoardContentGateway from 'server/board/trelloBoardContentGateway'
import { withDB as _withDB } from 'server/db'
import { PoolClient } from 'pg'

export async function boardContentGateway(userId: Id, boardId: Id): Promise<BoardContentGateway> {
  const config = await configForBoard(userId, boardId)

  if (config.dataSource === 'trello') {
    return trelloBoardContentGateway(userId, config)
  }
  return pgBoardContentGateway(userId, config)
}

async function configForBoard(userId: Id, boardId: Id): Promise<BoardConfig> {
  const config = await withDB<DbBoardConfig>(async (db) => {
    const result = await db.query('SELECT id, data_source, config FROM board_configs WHERE id = $1', [boardId])

    if (result.rowCount !== 1) {
      throw new Error(`Unknown board ${boardId}`)
    }

    return result.rows[0]
  })

  return { id: config.id, dataSource: config.data_source, config: config.config }
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
          config JSONB
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
  config?: unknown
}
