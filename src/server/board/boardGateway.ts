import { PoolClient } from 'pg'
import short from 'short-uuid'
import { withDB as _withDB } from 'server/db'
import { Board, Id, Section, Card } from 'shared/board/model'

const boards: Map<Id, Board> = new Map()

let hasInitialized = false

async function withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  console.log(`hasInitialized ${hasInitialized}`)
  if (!hasInitialized) {
    hasInitialized = true

    await _withDB(async (db) => {
      try {
        await db.query(`
          CREATE TABLE IF NOT EXISTS board (
            id text PRIMARY KEY,
            name text NOT NULL,
            version integer NOT NULL
          );

          CREATE TABLE IF NOT EXISTS board_section (
            id text PRIMARY KEY,
            board_id text NOT NULL,
            name text NOT NULL,
            version integer NOT NULL,
            position integer NOT NULL,
            cards JSONB NOT NULL,

            CONSTRAINT fk_board
              FOREIGN KEY(board_id) 
              REFERENCES board(id)
              ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS board_card (
            id text PRIMARY KEY,
            board_id text NOT NULL,
            version integer NOT NULL,
            content text NOT NULL,

            CONSTRAINT fk_board
              FOREIGN KEY(board_id) 
              REFERENCES board(id)
              ON DELETE CASCADE
          );
        `)
      } catch (error) {
        console.log(`BoardGateway init error ${JSON.stringify(error)}`)
      }
    })
  }

  return _withDB(func)
}

export async function fetchBoard(userId: Id, boardId: Id): Promise<Board> {
  const board = boards.get(boardId)
  if (board) {
    return board
  }

  const result = await withDB((db) => db.query('SELECT name, id FROM board WHERE id=$1', [boardId]))

  if (result.rows.length == 0) {
    throw Error(`Board ${boardId} not found`)
  } else {
    const loadedBoard: Board = result.rows[0]
    boards.set(loadedBoard.id, loadedBoard)
    return loadedBoard
  }
}

export async function addBoard(name: string): Promise<Board> {
  const boardId = short.generate()

  const result = await withDB((db) =>
    db.query('INSERT INTO board (id, name, version) VALUES ($1, $2, $3);', [boardId, name, 0])
  )
  if (result.rowCount !== 1) {
    throw Error(`Couldn't create board ${name}`)
  }

  return { id: boardId, name, version: 0 }
}

export async function fetchSections(boardId: Id): Promise<Section[]> {
  const result = await withDB((db) =>
    db.query('SELECT name, id, cards FROM board_section WHERE board_id=$1 ORDER BY position ASC', [boardId])
  )

  return result.rows as Section[]
}

export async function addSection(boardId: Id, name: string, position: number): Promise<Section> {
  const sectionId = short.generate()

  const result = await withDB((db) =>
    db.query(
      "INSERT INTO board_section (id, board_id, name, version, position, cards) VALUES ($1, $2, $3, $4, $5, '[]'::jsonb);",
      [sectionId, boardId, name, 0, position]
    )
  )

  if (result.rowCount !== 1) {
    throw Error(`Couldn't create section ${name}`)
  }

  return { id: sectionId, version: 0, name, cards: [] }
}

export async function addCard(boardId: Id, sectionId: Id, name: string, content: string): Promise<Card> {
  const cardId = short.generate()

  const cardJson = JSON.stringify([{ id: cardId, name }])

  await withDB(async (db) => {
    try {
      await db.query('BEGIN TRANSACTION;')

      await db.query('INSERT INTO board_card (id, board_id, version, content) VALUES ($1, $2, $3, $4);', [
        cardId,
        boardId,
        0,
        content,
      ])

      await db.query('UPDATE board_section SET cards = cards || $2 WHERE id = $1;', [sectionId, cardJson])

      await db.query('COMMIT;')
    } catch (error) {
      await db.query('ROLLBACK;')
      throw error
    }
  })

  return { id: cardId, name, version: 0 }
}
