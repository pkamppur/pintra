import useSWR from 'swr'
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

export function useFetch<T>(urlOrPath: string | null) {
  const { data, error } = useSWR<T>(urlOrPath, fetcher)
  console.log(`url ${urlOrPath}: data: ${JSON.stringify(data)}`)

  return { data, error, loading: !error && !data }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const errorBody = await res.json()
    const error = new HttpError('An error occurred while fetching the data.', res.status, errorBody)
    // Attach extra info to the error object.
    throw error
  }
  return res.json()
}

class HttpError extends Error {
  status: number
  bodyJson: any

  constructor(message: string, status: number, bodyJson: any) {
    super(message)
    this.status = status
    this.bodyJson = bodyJson
  }
}
