import { CSSProperties } from 'react'
import { BoardContent, BoardStyles } from 'shared/board/model'
import BoardContents from 'components/board/boardContents'
import styles from './board-page.module.scss'

interface BoardPageProps {
  board: BoardContent
}

export default function BoardPage({ board }: BoardPageProps) {
  return (
    <div className={styles.main} style={stylesForBoardStyles(board.styles)}>
      <BoardContents board={board} />
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
