import { PoolClient } from 'pg'
import short from 'short-uuid'
import { withDB as _withDB } from 'server/db'
import { Board, Id } from 'shared/board/model'

let hasInitialized = false

async function withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  if (!hasInitialized) {
    console.log(`Init Board Gateway DB`)
    hasInitialized = true

    await _withDB(async (db) => {
      try {
        await db.query(`
          CREATE TABLE IF NOT EXISTS boards (
            id text PRIMARY KEY,
            version integer NOT NULL,

            name text NOT NULL,
            text_color text,
            background_color text
          );
        `)
      } catch (error) {
        console.log(`BoardGateway init error ${JSON.stringify(error)}`)
      }
    })
  }

  return _withDB(func)
}

export async function fetchBoards(userId: Id): Promise<Board[]> {
  // Disabled for privacy/security. One credential for now, so don't want to leak all boards to everyone sharing the same credentials.
  // return await withDB((db) => boardsFromDb(db))
  return []
}

async function boardsFromDb(db: PoolClient): Promise<Board[]> {
  const result = await db.query<DbBoard>('SELECT name, id, text_color, background_color FROM boards ORDER BY name ASC')

  return result.rows.map(mapDbBoardToBoard)
}

export async function fetchBoard(userId: Id, boardId: Id): Promise<Board> {
  return await withDB((db) => boardFromDb(db, boardId))
}

async function boardFromDb(db: PoolClient, boardId: Id): Promise<Board> {
  const result = await db.query<DbBoard>('SELECT name, id, text_color, background_color FROM boards WHERE id=$1', [
    boardId,
  ])

  if (result.rows.length === 0) {
    throw Error(`Board ${boardId} not found`)
  }

  return mapDbBoardToBoard(result.rows[0])
}

interface DbBoard {
  id: string
  version: number

  name: string
  text_color?: string
  background_color?: string
}

const mapDbBoardToBoard = (dbBoard: DbBoard): Board => ({
  id: dbBoard.id,
  version: dbBoard.version,
  name: dbBoard.name,
  textColor: dbBoard.text_color,
  backgroundColor: dbBoard.background_color,
})

export async function addBoard(name: string): Promise<Board> {
  const boardId = short.generate()

  const result = await withDB((db) =>
    db.query('INSERT INTO boards (id, name, version) VALUES ($1, $2, $3);', [boardId, name, 0])
  )
  if (result.rowCount !== 1) {
    throw Error(`Couldn't create board ${name}`)
  }

  return { id: boardId, name, version: 0 }
}
