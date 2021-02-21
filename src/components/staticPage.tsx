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

  const searchResultsBoard = searchTerm ? filterBoard(board, searchTerm) : undefined

  return (
    <StaticPageScaffold title={title} topBarItem={topBarItem}>
      <BoardPage
        board={searchResultsBoard ?? board}
        currentCard={currentCard}
        setCurrentCard={setCurrentCard}
        currentCardContentResult={currentCardContentResult}
      />
    </StaticPageScaffold>
  )
}

function filterBoard(board: StaticBoardContent, searchTerm: string): StaticBoardContent {
  const lowerCaseSearchTerm = searchTerm.toLocaleLowerCase()
  const sections = board.sections
    .map((section) => {
      const cards = section.cards.filter((card) => {
        return cardMatchesSearchTerm(card, lowerCaseSearchTerm)
      })
      return { ...section, cards }
    })
    .filter((section) => section.cards.length > 0)
  return { ...board, sections }
}

function cardMatchesSearchTerm(card: StaticCard, lowerCaseSearchTerm: string): boolean {
  return (
    card.name.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
    card.content.toLocaleLowerCase().includes(lowerCaseSearchTerm) ||
    card.tags.filter((tag) => tag.name.toLocaleLowerCase().includes(lowerCaseSearchTerm)).length > 0
  )
}
