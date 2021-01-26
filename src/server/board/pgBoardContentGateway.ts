import { PoolClient } from 'pg'
import short from 'short-uuid'
import { withDB as _withDB } from 'server/db'
import { Id, Section, Card, CardContent, BoardContent, Tag, Board } from 'shared/board/model'
import { BoardConfig, BoardContentGateway } from 'server/board/boardContentGateway'

export default async function pgBoardContentGateway(username: Id, config: BoardConfig): Promise<BoardContentGateway> {
  return {
    fetchBoard: async () => {
      return await fetchBoard(username, config.id)
    },
    fetchBoardContent: async () => {
      return await fetchBoardContent(username, config.id)
    },
    fetchCardContent: async (cardId: Id) => {
      return await fetchCardContent(config.id, cardId)
    },
    searchCards: async (searchTerm: string) => {
      return await searchCards(username, config.id, searchTerm)
    },
  }
}

let hasInitializedDb = false

async function withDB<T>(func: (db: PoolClient) => Promise<T>): Promise<T> {
  if (!hasInitializedDb) {
    console.log(`Init BoardContent Gateway DB`)
    hasInitializedDb = true

    await _withDB(async (db) => {
      try {
        await db.query(`
          CREATE TABLE IF NOT EXISTS boards (
            id text PRIMARY KEY,
            version integer NOT NULL,

            name text NOT NULL,
            text_color text,
            background_color text,

            CONSTRAINT fk_board_configs
              FOREIGN KEY (id) 
              REFERENCES board_configs (id)
              ON DELETE CASCADE
          );
        `)

        await db.query(`
          CREATE TABLE IF NOT EXISTS sections (
            id text PRIMARY KEY,
            board_id text NOT NULL,

            version integer NOT NULL,

            position integer NOT NULL,

            name text NOT NULL,
            text_color text,
            background_color text,

            CONSTRAINT fk_board
              FOREIGN KEY (board_id) 
              REFERENCES boards (id)
              ON DELETE CASCADE
          );
        `)

        await db.query(`
          CREATE TABLE IF NOT EXISTS cards (
            id text PRIMARY KEY,
            section_id text NOT NULL,

            version integer NOT NULL,

            position integer NOT NULL,

            name text NOT NULL,
            content text NOT NULL,

            CONSTRAINT fk_section
              FOREIGN KEY(section_id) 
              REFERENCES sections (id)
              ON DELETE CASCADE
          );
        `)

        await db.query(`
          CREATE TABLE IF NOT EXISTS tags (
            id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            board_id text NOT NULL,
            name TEXT NOT NULL,
            UNIQUE(board_id, name),

            CONSTRAINT fk_board
              FOREIGN KEY (board_id) 
              REFERENCES boards (id)
              ON DELETE CASCADE
          );
        `)

        await db.query(`
          CREATE TABLE IF NOT EXISTS card_tags (
            id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            card_id text NOT NULL,
            tag_id integer NOT NULL,
            UNIQUE(card_id, tag_id),

            CONSTRAINT fk_card
              FOREIGN KEY (card_id) 
              REFERENCES cards (id)
              ON DELETE CASCADE,

            CONSTRAINT fk_tag
              FOREIGN KEY (tag_id) 
              REFERENCES tags (id)
              ON DELETE RESTRICT
          );
        `)
      } catch (error) {
        console.log(`BoardGateway init error ${JSON.stringify(error)}`)
      }
    })
  }

  return _withDB(func)
}

async function boardsFromDb(db: PoolClient): Promise<Board[]> {
  const result = await db.query<DbBoard>('SELECT name, id, text_color, background_color FROM boards ORDER BY name ASC')

  return result.rows.map(mapDbBoardToBoard)
}

async function fetchBoard(userId: Id, boardId: Id): Promise<Board> {
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

async function addBoard(name: string): Promise<Board> {
  const boardId = short.generate()

  const result = await withDB((db) =>
    db.query('INSERT INTO boards (id, name, version) VALUES ($1, $2, $3);', [boardId, name, 0])
  )
  if (result.rowCount !== 1) {
    throw Error(`Couldn't create board ${name}`)
  }

  return { id: boardId, name, version: 0 }
}

async function fetchBoardContent(userId: Id, boardId: Id): Promise<BoardContent> {
  const board = await fetchBoard(userId, boardId)

  const sections = await withDB(async (db) => {
    return await sectionsForBoardFromDb(db, boardId)
  })

  return { ...board, sections }
}

async function fetchSections(boardId: Id): Promise<Section[]> {
  const sections = await withDB(async (db) => sectionsForBoardFromDb(db, boardId))

  return sections
}

const dbSectionsForBoard = async (db: PoolClient, boardId: Id) =>
  (
    await db.query<DbSection>(
      'SELECT name, id, text_color, background_color FROM sections WHERE board_id=$1 ORDER BY position ASC',
      [boardId]
    )
  ).rows

interface DbSection {
  id: string
  version: number

  name: string
  text_color?: string
  background_color?: string
}

async function sectionsForBoardFromDb(db: PoolClient, boardId: Id): Promise<Section[]> {
  const dbSectionsRes = await dbSectionsForBoard(db, boardId)

  const sections = await Promise.all<Section>(
    dbSectionsRes.map(async (dbSection) => {
      const cards = await fetchCardsFromDb(db, dbSection.id)

      return {
        id: dbSection.id,
        version: dbSection.version,
        name: dbSection.name,
        textColor: dbSection.text_color,
        backgroundColor: dbSection.background_color,
        cards,
      }
    })
  )

  return sections
}

async function fetchCards(boardId: Id, sectionId: Id): Promise<Card[]> {
  return await withDB((db) => fetchCardsFromDb(db, sectionId))
}

async function fetchCardsFromDb(db: PoolClient, sectionId: Id): Promise<Card[]> {
  const result = await db.query<DbCard>(
    'SELECT name, id, version FROM cards WHERE section_id=$1 ORDER BY position ASC',
    [sectionId]
  )

  const cardIds = result.rows.map((dbCard) => dbCard.id)
  const tags = await db.query<DbTaggedCard>(
    `SELECT card_tags.card_id AS card_id, array_agg(ARRAY[tags.name, CAST ( tags.id AS TEXT)]) AS tags FROM card_tags, tags
    WHERE card_tags.tag_id = tags.id AND card_tags.card_id = ANY($1::text[])
    GROUP BY card_tags.card_id;`,
    [cardIds]
  )
  const tagMap = tags.rows.reduce((map, tagResult) => {
    const cardTags = tagResult.tags.map((array) => ({ id: array[1], name: array[0] }))
    map.set(tagResult.card_id, cardTags)
    return map
  }, new Map<string, Tag[]>())

  return result.rows.map((card) => ({
    ...card,
    tags: tagMap.get(card.id) || [],
  }))
}

interface DbCard {
  id: string
  version: number

  name: string
}

interface DbTaggedCard {
  card_id: string
  tags: string[][]
}

async function addSection(boardId: Id, name: string, position: number): Promise<Section> {
  const sectionId = short.generate()

  const result = await withDB((db) =>
    db.query('INSERT INTO sections (id, board_id, version, position, name) VALUES ($1, $2, $3, $4, $5);', [
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

async function addCard(boardId: Id, sectionId: Id, position: number, name: string, content: string): Promise<Card> {
  const cardId = short.generate()

  await withDB(async (db) => {
    await db.query(
      'INSERT INTO cards (id, section_id, version, position, name, content) VALUES ($1, $2, $3, $4, $5, $6);',
      [cardId, sectionId, 0, position, name, content]
    )
  })

  return { id: cardId, name, version: 0, tags: [] }
}

async function fetchCardContent(boardId: Id, cardId: Id): Promise<CardContent> {
  const result = await withDB((db) => db.query<CardContent>('SELECT content FROM cards WHERE id=$1;', [cardId]))

  return result.rows[0]
}

interface ObjectWithId {
  id: Id
}

async function searchCards(userId: string, boardId: Id, searchTerm: string): Promise<BoardContent> {
  const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase()
  const mapToId = (item: ObjectWithId) => item.id
  const board = await fetchBoard(userId, boardId)

  const result = await withDB(async (db) => {
    const sections = await sectionsForBoardFromDb(db, boardId)

    const cardIdsWithContentMatches = (
      await db.query<ObjectWithId>(
        "SELECT id FROM cards WHERE section_id in (SELECT id from sections WHERE board_id=$1) AND content ILIKE '%' || $2 || '%';",
        [boardId, lowerCaseSearchTerm]
      )
    ).rows.map(mapToId)

    const cardIdsWithTagMatches = (
      await db.query<ObjectWithId>(
        `SELECT card_tags.card_id AS id FROM card_tags, tags, cards
          WHERE card_tags.tag_id = tags.id AND card_tags.card_id = cards.id AND tags.name ILIKE '%' || $1 || '%'
          GROUP BY card_tags.card_id;`,
        [searchTerm]
      )
    ).rows.map(mapToId)

    const matchingSections = sections
      .map((section) => {
        const cards = section.cards.filter((card) => {
          return (
            card.name.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
            cardIdsWithContentMatches.includes(card.id) ||
            cardIdsWithTagMatches.includes(card.id)
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

    return { ...board, sections: matchingSections }
  })

  return result
}
