import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { BoardContent, Id } from 'shared/board/model'
import Scaffold from 'components/scaffold'
import { useFetchBoardContent, useFetchSearch, useFetchCardContent } from 'components/board/useFetchBoard'
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
        <div className={styles.main}>
          <div>failed to load {JSON.stringify(error)}</div>
        </div>
      </Scaffold>
    )
  }

  if (!boardId || loading || !data) {
    return (
      <Scaffold title="Loading… | Pintra" loginRedirect={pagePath}>
        <div className={styles.main}>
          <div>Loading…</div>
        </div>
      </Scaffold>
    )
  }

  const board = searchFetch.data || data
  return <LoadedBoard boardId={boardId} board={board} setSearchTerm={setSearchTerm} pagePath={pagePath} />
}

interface BoardPageProps {
  boardId: string
  board: BoardContent
  setSearchTerm: Dispatch<SetStateAction<string>>
  pagePath: string
}

function LoadedBoard({ boardId, board, setSearchTerm, pagePath }: BoardPageProps) {
  const navBarItems = SearchBox({ search: setSearchTerm })
  const [currentCard, setCurrentCard] = useState<{ index: number; id: string } | undefined>(undefined)

  const currentCardContentResult = useFetchCardContent(boardId, currentCard?.id)

  return (
    <Scaffold title={`${board.name} | Pintra`} loginRedirect={pagePath} additionalNavComponent={navBarItems}>
      <BoardPage
        board={board}
        currentCard={currentCard}
        setCurrentCard={setCurrentCard}
        currentCardContentResult={currentCardContentResult}
      />
    </Scaffold>
  )
}
