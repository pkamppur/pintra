import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { BoardContent } from 'shared/board/model'
import Scaffold from 'components/scaffold'
import { useFetchBoardContent, useFetchSearch } from 'components/board/useFetchBoard'
import { asString } from 'components/stringHelpers'
import SearchBox from 'components/searchbox/searchbox'
import BoardPage from 'components/board-page/board-page'
import styles from './board.module.scss'

export default function DynamicBoardPage() {
  const router = useRouter()

  const rawBoardId = router.query.boardId
  const boardId = asString(rawBoardId)
  const pagePath = router.asPath

  const { loading, data, error } = useFetchBoardContent(boardId)

  const [searchTerm, setSearchTerm] = useState('')
  const searchFetch = useFetchSearch(boardId, searchTerm)

  if (error) {
    return (
      <Scaffold title="Error Loading | Pintra" loginRedirect={pagePath}>
        <main className={styles.main}>
          <div>failed to load {JSON.stringify(error)}</div>
        </main>
      </Scaffold>
    )
  }

  if (loading || !data) {
    return (
      <Scaffold title="Loading… | Pintra" loginRedirect={pagePath}>
        <main className={styles.main}>
          <div>Loading…</div>
        </main>
      </Scaffold>
    )
  }

  const board = searchFetch.data || data
  return <LoadedBoard board={board} setSearchTerm={setSearchTerm} pagePath={pagePath} />
}

interface BoardPageProps {
  board: BoardContent
  setSearchTerm: Dispatch<SetStateAction<string>>
  pagePath: string
}

function LoadedBoard({ board, setSearchTerm, pagePath }: BoardPageProps) {
  const navBarItems = SearchBox({ search: setSearchTerm })

  return (
    <Scaffold title={`${board.name} | Pintra`} loginRedirect={pagePath} additionalNavComponent={navBarItems}>
      <BoardPage board={board} />
    </Scaffold>
  )
}
