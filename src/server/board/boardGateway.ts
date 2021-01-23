import { Pool, PoolClient } from 'pg'
import short from 'short-uuid'
import { withDB as _withDB } from 'server/db'
import { Board, Id, Section, Card, CardContent, BoardContent } from 'shared/board/model'

const boards: Map<Id, Board> = new Map()

let hasInitialized = false

async function withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  if (!hasInitialized) {
    console.log(`Init DB`)
    hasInitialized = true

    await _withDB(async (db) => {
      try {
        await db.query(`
          CREATE TABLE IF NOT EXISTS board (
            id text PRIMARY KEY,
            version integer NOT NULL,

            name text NOT NULL,
          );

          CREATE TABLE IF NOT EXISTS board_section (
            id text PRIMARY KEY,
            board_id text NOT NULL,

            version integer NOT NULL,

            position integer NOT NULL,

            name text NOT NULL,

            CONSTRAINT fk_board
              FOREIGN KEY(board_id) 
              REFERENCES board(id)
              ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS board_card (
            id text PRIMARY KEY,
            section_id text NOT NULL,

            version integer NOT NULL,

            position integer NOT NULL,

            name text NOT NULL,
            content text NOT NULL,

            CONSTRAINT fk_section
              FOREIGN KEY(section_id) 
              REFERENCES board_section(id)
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

  const loadedBoard = await withDB((db) => boardFromDb(db, boardId))

  boards.set(loadedBoard.id, loadedBoard)
  return loadedBoard
}

async function boardFromDb(db: PoolClient, boardId: Id) {
  const result = await db.query<Board>('SELECT name, id FROM board WHERE id=$1', [boardId])

  if (result.rows.length === 0) {
    throw Error(`Board ${boardId} not found`)
  }

  return result.rows[0]
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

export async function fetchBoardContents(userId: Id, boardId: Id): Promise<BoardContent> {
  const boardContent = await withDB(async (db) => {
    return boardContentsFromDb(db, boardId)
  })

  return boardContent
}

async function boardContentsFromDb(db: PoolClient, boardId: Id): Promise<BoardContent> {
  const board = await boardFromDb(db, boardId)

  const sections = await sectionsForBoardFromDb(db, boardId)

  return { ...board, sections }
}

interface DbSection {
  id: string
  version: number

  name: string
}

export async function fetchSections(boardId: Id): Promise<Section[]> {
  const sections = await withDB(async (db) => sectionsForBoardFromDb(db, boardId))

  return sections
}

const dbSectionsForBoard = async (db: PoolClient, boardId: Id) =>
  (await db.query<DbSection>('SELECT name, id FROM board_section WHERE board_id=$1 ORDER BY position ASC', [boardId]))
    .rows

async function sectionsForBoardFromDb(db: PoolClient, boardId: Id): Promise<Section[]> {
  const dbSectionsRes = await dbSectionsForBoard(db, boardId)

  const sections = await Promise.all(
    dbSectionsRes.map(async (dbSection) => {
      const cards = await fetchCardsFromDb(db, dbSection.id)

      return { ...dbSection, cards }
    })
  )

  return sections
}

export async function fetchCards(boardId: Id, sectionId: Id): Promise<Card[]> {
  return await withDB((db) => fetchCardsFromDb(db, sectionId))
}

async function fetchCardsFromDb(db: PoolClient, sectionId: Id): Promise<Card[]> {
  const result = await db.query<Card>(
    'SELECT name, id, version FROM board_card WHERE section_id=$1 ORDER BY position ASC',
    [sectionId]
  )

  return result.rows
}

export async function addSection(boardId: Id, name: string, position: number): Promise<Section> {
  const sectionId = short.generate()

  const result = await withDB((db) =>
    db.query('INSERT INTO board_section (id, board_id, version, position, name) VALUES ($1, $2, $3, $4, $5);', [
      sectionId,
      boardId,
      0,
      position,
      name,
    ])
  )

  if (result.rowCount !== 1) {
    throw Error(`Couldn't create section ${name}`)
  }

  return { id: sectionId, version: 0, name, cards: [] }
}

export async function addCard(
  boardId: Id,
  sectionId: Id,
  position: number,
  name: string,
  content: string
): Promise<Card> {
  const cardId = short.generate()

  await withDB(async (db) => {
    await db.query(
      'INSERT INTO board_card (id, section_id, version, position, name, content) VALUES ($1, $2, $3, $4, $5, $6);',
      [cardId, sectionId, 0, position, name, content]
    )
  })

  return { id: cardId, name, version: 0 }
}

export async function fetchCardContent(boardId: Id, cardId: Id): Promise<CardContent> {
  const result = await withDB((db) => db.query<CardContent>('SELECT content FROM board_card WHERE id=$1;', [cardId]))

  return result.rows[0]
}

interface ObjectWithId {
  id: Id
}

export async function searchCards(boardId: Id, searchTerm: string): Promise<BoardContent> {
  const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase()
  const mapToId = (item: { id: Id }) => item.id

  const result = await withDB(async (db) => {
    const boardContents = await boardContentsFromDb(db, boardId)
    const cardIdsWithContentMatches = (
      await db.query<ObjectWithId>(
        "SELECT id FROM board_card WHERE section_id in (SELECT id from board_section WHERE board_id=$1) AND content ILIKE '%' || $2 || '%';",
        [boardId, lowerCaseSearchTerm]
      )
    ).rows.map(mapToId)

    const matchingSections = boardContents.sections
      .map((section) => {
        const cards = section.cards.filter((card) => {
          return (
            card.name.toLocaleLowerCase().includes(lowerCaseSearchTerm) || cardIdsWithContentMatches.includes(card.id)
          )
        })

        if (section.name.toLocaleLowerCase().includes(lowerCaseSearchTerm) || cards.length > 0) {
          return { ...section, cards }
        } else {
          return null
        }
      })
      .filter((section) => section)
      .map((section) => section as Section)

    return { ...boardContents, sections: matchingSections }
  })

  return result
}
