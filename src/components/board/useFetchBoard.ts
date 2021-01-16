import useSWR from 'swr'
import { Board } from './model'

export default function useFetchBoard(boardId?: string) {
  return useFetch<Board>(boardId ? `/api/boards/${boardId}` : null)
}

export function useFetch<T>(urlOrPath: string | null) {
  const { data, error } = useSWR<T>(urlOrPath)

  return { data, error, loading: !error && !data }
}
