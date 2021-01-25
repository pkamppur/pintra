import useSWR from 'swr'

export default function useFetch<T>(urlOrPath: string | null) {
  const { data, error } = useSWR<T>(urlOrPath, fetcher)

  return { data, error, loading: !error && !data }
}

export const fetcher = async <T>(url: string, options?: RequestInit) => {
  const res = await fetch(url, options)
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const errorBody = await res.json()
    const error = new HttpError('An error occurred while fetching the data.', res.status, errorBody)
    // Attach extra info to the error object.
    throw error
  }
  return res.json() as Promise<T>
}

class HttpError extends Error {
  status: number
  bodyJson: unknown

  constructor(message: string, status: number, bodyJson: unknown) {
    super(message)
    this.status = status
    this.bodyJson = bodyJson
  }
}
