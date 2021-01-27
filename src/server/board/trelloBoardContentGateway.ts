import { BoardConfig, BoardContentGateway } from 'server/board/boardContentGateway'
import { Board, Id, Section } from 'shared/board/model'
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
    const result = fetcher<T>(`https://api.trello.com${path}?key=${trelloApiKey}&token=${trelloToken}`, {
      method: 'GET',
    })
    return result
  }

  const trelloBoard = async (): Promise<TrelloBoard> => {
    return await trelloApi<TrelloBoard>(`/1/boards/${trelloBoardId}`)
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
        backgroundColor: board.prefs.backgroundColor,
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
      const lists = await trelloApi<TrelloList[]>(`/1/boards/${trelloBoardId}/lists`)

      const sections: Section[] = await Promise.all(
        lists.map(async (list) => {
          const trelloCards = await trelloApi<TrelloCard[]>(`/1/lists/${list.id}/cards`)
          const cards = trelloCards.map((card) => {
            return {
              id: card.id,
              version: 0,
              name: card.name,
              tags: card.labels.map((label) => {
                return { name: label.name, id: label.id }
              }),
            }
          })

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
  backgroundColor: string
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
