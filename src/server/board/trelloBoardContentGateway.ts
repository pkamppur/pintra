import { BoardConfig, BoardContentGateway } from 'server/board/boardContentGateway'
import { Board, Card, Id, Section } from 'shared/board/model'
import { fetcher } from 'components/network/useFetch'

export default async function trelloBoardContentGateway(
  username: Id,
  config: BoardConfig
): Promise<BoardContentGateway> {
  const secrets = config.secrets as TrelloSecrets
  const options = config.options as TrelloConfigOptions
  const trelloBoardId = options?.boardId
  const trelloApiKey = secrets?.apiKey
  const trelloToken = secrets?.apiToken

  if (!trelloBoardId || !trelloApiKey || !trelloToken) {
    throw new Error('Missing Trello configuration')
  }

  const trelloApi = async <T>(path: string) => {
    const querySeparator = path.includes('?') ? '&' : '?'
    const result = fetcher<T>(
      `https://api.trello.com${path}${querySeparator}key=${trelloApiKey}&token=${trelloToken}`,
      {
        method: 'GET',
      }
    )
    return result
  }

  const trelloBoard = async (): Promise<TrelloBoard> => {
    return await trelloApi<TrelloBoard>(`/1/boards/${trelloBoardId}`)
  }

  const trelloListsForBoard = async (): Promise<TrelloList[]> => {
    return await trelloApi<TrelloList[]>(`/1/boards/${trelloBoardId}/lists`)
  }

  const trelloCardsForList = async (listId: string): Promise<TrelloCard[]> => {
    return await trelloApi<TrelloCard[]>(`/1/lists/${listId}/cards`)
  }

  const fetchBoardFromTrello = async () => {
    const board = await trelloBoard()

    return {
      board: {
        id: config.id,
        name: board.name,
        version: 0,
      },
      styles: {
        textColor: board.prefs.backgroundBrightness === 'dark' ? 'white' : 'rgb(0, 0, 0, 0.85)',
        backgroundColor: board.prefs.backgroundColor ? board.prefs.backgroundColor : undefined,
        background:
          board.prefs.backgroundTopColor && board.prefs.backgroundBottomColor
            ? `linear-gradient(${board.prefs.backgroundTopColor}, ${board.prefs.backgroundBottomColor})`
            : undefined,
        backgroundImage: board.prefs.backgroundImage ? `url(${board.prefs.backgroundImage})` : undefined,
      },
    }
  }

  return {
    fetchBoard: async () => {
      const { board } = await fetchBoardFromTrello()
      return { id: config.id, version: 0, name: board.name }
    },
    fetchBoardContent: async () => {
      const { board, styles } = await fetchBoardFromTrello()
      const lists = await trelloListsForBoard()

      const sections: Section[] = await Promise.all(
        lists.map(async (list) => {
          const trelloCards = await trelloCardsForList(list.id)
          const cards = trelloCards.map(mapTrelloCardToCard)

          return { id: list.id, version: 0, name: list.name, cards }
        })
      )

      return { ...board, styles, sections }
    },
    fetchCardContent: async (cardId: Id) => {
      const trelloCard = await trelloApi<TrelloCard>(`/1/cards/${cardId}`)
      return { content: trelloCard.desc }
    },
    searchCards: async (searchTerm: string) => {
      const { board, styles } = await fetchBoardFromTrello()
      return { ...board, styles, sections: [] }
    },
  }
}

function mapTrelloCardToCard(card: TrelloCard): Card {
  return {
    id: card.id,
    version: 0,
    name: card.name,
    tags: card.labels.map((label) => {
      return { name: label.name, id: label.id }
    }),
  }
}

interface TrelloSecrets {
  apiKey: string
  apiToken: string
}

interface TrelloConfigOptions {
  boardId: string
}

interface TrelloBoard {
  id: string
  name: string

  prefs: TrelloBoardPrefs
}

interface TrelloBoardPrefs {
  backgroundBrightness: string
  backgroundColor?: string
  backgroundBottomColor?: string
  backgroundTopColor?: string
  backgroundImage?: string
}

interface TrelloList {
  id: string
  name: string
}

interface TrelloCard {
  id: string
  name: string
  desc: string
  labels: TrelloLabel[]
}

interface TrelloLabel {
  id: string
  name: string
}
