import { Id, CardContent, BoardContent } from 'shared/board/model'

export interface BoardContentGateway {
  fetchBoardContent: () => Promise<BoardContent>
  fetchCardContent: (cardId: Id) => Promise<CardContent>
  searchCards: (searchTerm: string) => Promise<BoardContent>
}

export interface BoardConfig {
  id: Id
  dataSource: string
  secrets?: unknown
  options?: unknown
}
