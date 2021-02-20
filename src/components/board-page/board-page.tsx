import { CSSProperties } from 'react'
import { BoardContent, BoardStyles, CardContentLoadResult } from 'shared/board/model'
import BoardContents from 'components/board/boardContents'
import styles from './board-page.module.scss'

interface BoardPageProps {
  board: BoardContent
  currentCard?: { index: number; id: string }
  setCurrentCard: (card: { index: number; id: string } | undefined) => void
  currentCardContentResult: CardContentLoadResult
}

export default function BoardPage(props: BoardPageProps) {
  return (
    <div className={styles.main} style={stylesForBoardStyles(props.board.styles)}>
      <BoardContents
        board={props.board}
        currentCard={props.currentCard}
        setCurrentCard={props.setCurrentCard}
        currentCardContentResult={props.currentCardContentResult}
      />
    </div>
  )
}

function stylesForBoardStyles(styles: BoardStyles): CSSProperties {
  if (styles.backgroundImage) {
    return {
      backgroundImage: styles.backgroundImage,
      backgroundSize: 'cover',
    }
  } else if (styles.background) {
    return {
      background: styles.background,
    }
  } else if (styles.backgroundColor) {
    return {
      backgroundColor: styles.backgroundColor,
    }
  } else {
    return {}
  }
}
