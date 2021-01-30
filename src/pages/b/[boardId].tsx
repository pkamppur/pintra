import { Dialog } from '@material-ui/core'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { BoardContent, Id, Section } from 'shared/board/model'
import Scaffold from 'components/scaffold'
import { useFetchBoardContent, useFetchSearch } from 'components/board/useFetchBoard'
import { asString } from 'components/stringHelpers'
import SearchBox from 'components/searchbox/searchbox'
import BoardContents from 'components/board/boardContents'
import styles from './board.module.scss'

export default function BoardPage() {
  const router = useRouter()

  const rawBoardId = router.query.boardId
  const boardId = asString(rawBoardId)

  const { loading, data, error } = useFetchBoardContent(boardId)

  const [searchTerm, setSearchTerm] = useState('')
  const searchFetch = useFetchSearch(boardId, searchTerm)

  const navBarItems = SearchBox({ search: setSearchTerm })

  const board = searchFetch.data || data
  let title: string
  let content: ReactNode

  if (error) {
    title = `Error Loading: ${boardId} | Pintra`
    content = <div>failed to load {JSON.stringify(error)}</div>
  } else if (loading || !board) {
    title = `Loading ${boardId} | Pintra`
    content = <div>Loading…</div>
  } else {
    title = `${board.name} | Pintra`
    content = <BoardContents board={board} />
  }

  return (
    <Scaffold title={title} loginRedirect={router.asPath} additionalNavComponent={navBarItems}>
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
