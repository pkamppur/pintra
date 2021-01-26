import { Id, CardContent, BoardContent, Board } from 'shared/board/model'

export interface BoardContentGateway {
  fetchBoard: () => Promise<Board>
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
