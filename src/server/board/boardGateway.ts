import { PoolClient } from 'pg'
import { withDB as _withDB } from 'server/db'
import { Board, Id } from 'shared/board/model'

const boards: Map<Id, Board> = new Map()

let hasInitialized = false

export async function withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  if (!hasInitialized) {
    hasInitialized = true

    await _withDB(async (db) => {
      await db.query(`
      CREATE TABLE IF NOT EXISTS board (id text PRIMARY KEY, name text NOT NULL);
      `)
    })
  }
  return _withDB(func)
}

export async function fetchBoard(userId: Id, id: Id): Promise<Board> {
  const board = boards.get(id)
  if (board) {
    return board
  }

  const result = await withDB((db) => db.query('SELECT name, id FROM board WHERE id=$1', [id]))

  if (result.rows.length == 0) {
    throw Error(`Board ${id} not found`)
  } else {
    const loadedBoard: Board = result.rows[0]
    boards.set(loadedBoard.id, loadedBoard)
    return loadedBoard
  }
}
