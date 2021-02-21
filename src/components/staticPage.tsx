import { useState } from 'react'
import SearchBox from 'components/searchbox/searchbox'
import BoardPage from 'components/board-page/board-page'
import { StaticPageScaffold } from 'components/static-page-scaffold/staticPageScaffold'
import { StaticBoardContent, StaticCard } from './staticModel'

export default function StaticBoardPage({ title, board }: { title: string; board: StaticBoardContent }) {
  const [searchTerm, setSearchTerm] = useState('')

  const topBarItem = SearchBox({ search: setSearchTerm })
  const [currentCard, setCurrentCard] = useState<{ index: number; id: string } | undefined>(undefined)

  const cards = board.sections.reduce<{ [key: string]: StaticCard }>((prev, cur) => {
    for (const card of cur.cards) {
      prev[card.id] = card
    }
    return prev
  }, {})

  const currentCardContent = currentCard?.id ? cards[currentCard.id] : undefined
  const currentCardContentResult = {
    data: currentCardContent ? { content: currentCardContent.content } : undefined,
    error: null,
    loading: !currentCardContent,
  }

  return (
    <StaticPageScaffold title={title} topBarItem={topBarItem}>
      <BoardPage
        board={board}
        currentCard={currentCard}
        setCurrentCard={setCurrentCard}
        currentCardContentResult={currentCardContentResult}
      />
    </StaticPageScaffold>
  )
}
