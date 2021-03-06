import useFetch from 'components/network/useFetch'
import { Board, Section, CardContent, BoardContent } from 'shared/board/model'

export function useFetchBoards() {
  return useFetch<Board[]>(`/api/boards/`)
}

export function useFetchBoard(boardId?: string) {
  return useFetch<Board>(boardId ? `/api/boards/${boardId}` : null)
}

export function useFetchBoardContent(boardId?: string) {
  return useFetch<BoardContent>(boardId ? `/api/boards/${boardId}/content` : null)
}

export function useFetchSections(boardId?: string) {
  return useFetch<Section[]>(boardId ? `/api/boards/${boardId}/sections/` : null)
}

export function useFetchCardContent(boardId?: string, cardId?: string) {
  return useFetch<CardContent>(boardId && cardId ? `/api/boards/${boardId}/cards/${cardId}/content/` : null)
}

export function useFetchSearch(boardId?: string, searchString?: string) {
  return useFetch<BoardContent>(
    boardId && searchString ? `/api/boards/${boardId}/search/?query=${encodeURIComponent(searchString)}` : null
  )
}
