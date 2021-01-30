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
      return { id: config.id, name: board.name }
    },
    fetchBoardContent: async () => {
      const { board, styles } = await fetchBoardFromTrello()
      const lists = await trelloListsForBoard()

      const sections: Section[] = await Promise.all(
        lists.map(async (list) => {
          const trelloCards = await trelloCardsForList(list.id)
          const cards = trelloCards.map(mapTrelloCardToCard)

          return { id: list.id, name: list.name, cards }
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
      const allListIds = (await trelloListsForBoard()).map((list) => list.id)

      const searchResult = await trelloApi<TrelloSearchResult>(
        `/1/search/?query=${encodeURIComponent(searchTerm)}&boards=${
          board.id
        }&modelTypes=cards&card_fields=name,desc&card_list=true&partial=true`
      )

      type TrelloListWithCards = TrelloList & { cards: TrelloCard[] }
      const listsWithMatchingCards = searchResult.cards.reduce<TrelloListWithCards[]>((cur, card) => {
        const list = cur.find((list) => list.id == card.list.id)
        if (list) {
          list.cards.push(card)
        } else {
          cur.push({ ...card.list, cards: [card] })
        }
        return cur
      }, [])

      const sections: Section[] = allListIds
        .map((listId) => {
          return listsWithMatchingCards.find((list) => list.id === listId)
        })
        .filter((list) => list)
        .map((list) => list as TrelloListWithCards)
        .map((list) => {
          return { id: list.id, name: list.name, cards: list.cards.map(mapTrelloCardToCard) }
        })

      return { ...board, styles, sections }
    },
  }
}

function mapTrelloCardToCard(card: TrelloCard): Card {
  return {
    id: card.id,
    name: card.name,
    tags: card.labels.map((label) => {
      const backgroundColor = mapTrelloColorToHtmlColor(label.color)
      const textColor = backgroundColor ? 'white' : undefined
      return { name: label.name, id: label.id, textColor, backgroundColor }
    }),
  }
}

function mapTrelloColorToHtmlColor(colorName: string): string | undefined {
  switch (colorName) {
    case 'green':
      return '#76be67'
    case 'yellow':
      return '#f3dd35'
    case 'red':
      return '#ec7767'
    case 'orange':
      return '#ffac39'
    case 'purple':
      return '#b381c7'
    case 'blue':
      return '#2772c7'
    case 'sky':
      return '#37c7f3'
    case 'black':
      return '#3c434e'
    case 'pink':
      return '#e081bc'
    case 'lime':
      return '#98ec76'
    default:
      return undefined
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
  color: string
}

interface TrelloSearchResult {
  cards: TrelloSearchResultCard[]
}

type TrelloSearchResultCard = TrelloCard & { list: TrelloList }
