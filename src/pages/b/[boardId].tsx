import { useRouter } from 'next/router'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { BoardContent } from 'shared/board/model'
import Scaffold from 'components/scaffold'
import { useFetchBoardContent, useFetchSearch } from 'components/board/useFetchBoard'
import { asString } from 'components/stringHelpers'
import SearchBox from 'components/searchbox/searchbox'
import BoardContents from 'components/board/boardContents'
import styles from './board.module.scss'

export default function DynamicBoardPage() {
  const router = useRouter()

  const rawBoardId = router.query.boardId
  const boardId = asString(rawBoardId)
  const pagePath = router.asPath

  const { loading, data, error } = useFetchBoardContent(boardId)

  const [searchTerm, setSearchTerm] = useState('')
  const searchFetch = useFetchSearch(boardId, searchTerm)

  return (
    <BoardPage
      data={data}
      loading={loading}
      error={error}
      searchData={searchFetch.data}
      setSearchTerm={setSearchTerm}
      pagePath={pagePath}
    />
  )
}

interface BoardPageProps {
  data?: BoardContent
  loading: boolean
  error: unknown
  searchData?: BoardContent
  setSearchTerm: Dispatch<SetStateAction<string>>
  pagePath: string
}

function BoardPage({ data, searchData, error, loading, setSearchTerm, pagePath }: BoardPageProps) {
  const navBarItems = SearchBox({ search: setSearchTerm })

  const board = searchData || data
  let title: string
  let content: ReactNode

  if (error) {
    title = `Error Loading | Pintra`
    content = <div>failed to load {JSON.stringify(error)}</div>
  } else if (loading || !board) {
    title = `Loading… | Pintra`
    content = <div>Loading…</div>
  } else {
    title = `${board.name} | Pintra`
    content = <BoardContents board={board} />
  }

  return (
    <Scaffold title={title} loginRedirect={pagePath} additionalNavComponent={navBarItems}>
      <main
        className={styles.main}
        style={{
          backgroundColor: board?.styles.backgroundColor,
          background: board?.styles.background,
          backgroundImage: board?.styles.backgroundImage,
          backgroundSize: board?.styles.backgroundImage ? 'cover' : undefined,
        }}
      >
        {content}
      </main>
    </Scaffold>
  )
}
