import { BoardConfig, BoardContentGateway } from 'server/board/boardContentGateway'
import { Id, Section } from 'shared/board/model'
import { fetchBoard } from './boardGateway'
import { fetcher } from 'components/network/useFetch'

export default async function trelloBoardContentGateway(
  username: Id,
  config: BoardConfig
): Promise<BoardContentGateway> {
  const trelloBoardId = ''
  const trelloApiKey = ''
  const trelloToken = ''

  const trelloApi = async <T>(path: string) => {
    const result = fetcher<T>(`https://api.trello.com${path}?key=${trelloApiKey}&token=${trelloToken}`, {
      method: 'GET',
    })
    return result
  }

  return {
    fetchBoardContent: async () => {
      const board = await fetchBoard(username, config.id)
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

      return { ...board, sections }
    },
    fetchCardContent: async (cardId: Id) => {
      const trelloCard = await trelloApi<TrelloCard>(`/1/cards/${cardId}`)
      return { content: trelloCard.desc }
    },
    searchCards: async (searchTerm: string) => {
      const board = await fetchBoard(username, config.id)
      return { ...board, sections: [] }
    },
  }
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
