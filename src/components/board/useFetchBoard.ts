import useFetch from 'components/network/useFetch'
import { Board, Section, CardContent } from 'shared/board/model'

export function useFetchBoard(boardId?: string) {
  return useFetch<Board>(boardId ? `/api/boards/${boardId}` : null)
}

export function useFetchSections(boardId?: string) {
  return useFetch<Section[]>(boardId ? `/api/boards/${boardId}/sections/` : null)
}

export function useFetchCardContent(boardId?: string, cardId?: string) {
  return useFetch<CardContent>(boardId && cardId ? `/api/boards/${boardId}/cards/${cardId}/content/` : null)
}
