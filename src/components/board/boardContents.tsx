import { Dialog, useMediaQuery } from '@material-ui/core'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { BoardContent, CardContentLoadResult, Section } from 'shared/board/model'
import CardContent from 'components/card-content/card-content'
import Card from 'components/card/card'
import useKeyPress from 'components/useKeyPress'
import InlineAddButton from 'components/inline-add-button/inline-add-button'
import styles from './boardContents.module.scss'

interface BoardContentProps {
  board: BoardContent
  currentCard?: { index: number; id: string }
  setCurrentCard: (card: { index: number; id: string } | undefined) => void
  currentCardContentResult: CardContentLoadResult
}

export default function BoardContents(props: BoardContentProps) {
  const [cardContent, setCardContent] = useState<ReactNode>()

  const openCard = (content: ReactNode) => {
    setCardContent(content)
  }

  const addCard = (name: string) => {
    console.log(`addCard ${name}`)
  }

  const closeCard = () => {
    props.setCurrentCard(undefined)
  }

  const desktopScreenWidthLimit = 600
  const isFullscreen = useMediaQuery(`(max-width:${desktopScreenWidthLimit}px)`)

  return (
    <>
      <Dialog
        open={!!props.currentCard}
        transitionDuration={100}
        fullScreen={isFullscreen}
        onClose={closeCard}
        aria-labelledby="Card Overlay"
        aria-describedby="Card Overlay"
      >
        <div className={styles.cardDialogContentContainer}>{cardContent}</div>
      </Dialog>
      <h1 style={{ color: props.board?.styles.textColor }}>{props.board.name}</h1>
      <Sections
        sections={props.board.sections}
        currentCard={props.currentCard}
        setCurrentCard={props.setCurrentCard}
        currentCardContentResult={props.currentCardContentResult}
        openCard={openCard}
        closeCard={closeCard}
      />
      {/*<InlineAddButton
          title="+ Add Card"
          addButtonLabel="Add Card"
          placeholder="Name for new card"
          addAction={addCard}
        />*/}
    </>
  )
}

function Sections({
  sections,
  currentCard,
  setCurrentCard,
  currentCardContentResult,
  openCard,
  closeCard,
}: {
  sections: Section[]
  currentCard?: { index: number; id: string }
  setCurrentCard: (card: { index: number; id: string } | undefined) => void
  currentCardContentResult: CardContentLoadResult
  openCard: (content: ReactNode) => void
  closeCard: () => void
}) {
  const allCards = sections.flatMap((section) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cards, ...displaySection } = section

    return section.cards.map((card) => {
      return { card, section: displaySection }
    })
  })

  const moveToPrev = () => {
    if (currentCard !== undefined) {
      const newIndex = currentCard.index - 1

      if (newIndex >= 0) {
        const prev = allCards[newIndex]
        setCurrentCard({ id: prev.card.id, index: newIndex })
      }
    }
  }

  const moveToNext = () => {
    if (currentCard !== undefined) {
      const newIndex = currentCard.index + 1

      if (newIndex < allCards.length) {
        const next = allCards[newIndex]
        setCurrentCard({ id: next.card.id, index: newIndex })
      }
    }
  }

  const shouldMoveToPrev = useKeyPress('ArrowLeft')
  const shouldMoveToNext = useKeyPress('ArrowRight')

  useEffect(() => {
    if (currentCard !== undefined) {
      const { card, section } = allCards[currentCard.index]
      const content = (
        <CardContent
          name={card.name}
          contentLoadResult={currentCardContentResult}
          close={closeCard}
          prev={moveToPrev}
          next={moveToNext}
          sectionName={section.name}
          sectionTitleColor={section.textColor}
          sectionBackgroundColor={section.backgroundColor}
        />
      )

      openCard(content)
    } else {
      closeCard()
    }
  }, [currentCard, currentCardContentResult])

  useEffect(() => {
    if (shouldMoveToPrev) {
      moveToPrev()
    }

    if (shouldMoveToNext) {
      moveToNext()
    }
  }, [shouldMoveToPrev, shouldMoveToNext])

  return <SectionsContent sections={sections} setCurrentCard={setCurrentCard} />
}

function SectionsContent({
  sections,
  setCurrentCard,
}: {
  sections: Section[]
  setCurrentCard: (card: { index: number; id: string } | undefined) => void
}) {
  let i = 0

  return (
    <>
      {sections.map((section) => (
        <div key={section.id}>
          <div
            className={styles.sectionDivider}
            style={{ color: section.textColor, backgroundColor: section.backgroundColor }}
          >
            {section.name}
          </div>
          <section className={styles.cards}>
            {section.cards.map((card) => {
              const index = i++

              return (
                <Card
                  key={card.id}
                  title={card.name}
                  tags={card.tags}
                  openCard={() => {
                    setCurrentCard({ index, id: card.id })
                  }}
                />
              )
            })}
          </section>
        </div>
      ))}
    </>
  )
}
