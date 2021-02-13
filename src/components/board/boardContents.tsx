import { ReactNode, useEffect, useState } from 'react'
import { Dialog, useMediaQuery } from '@material-ui/core'
import { BoardContent, Card as ModelCard, Id, Section } from 'shared/board/model'
import CardContent from 'components/card-content/card-content'
import Card from 'components/card/card'
import useKeyPress from 'components/useKeyPress'
import InlineAddButton from 'components/inline-add-button/inline-add-button'
import styles from './boardContents.module.scss'

export default function BoardContents({ board }: { board: BoardContent }) {
  const [cardContent, setCardContent] = useState<ReactNode>()
  const [cardOpen, setCardOpen] = useState(false)

  const openCard = (content: ReactNode) => {
    setCardContent(content)
    setCardOpen(true)
  }

  const addCard = (name: string) => {
    console.log(`addCard ${name}`)
  }

  const desktopScreenWidthLimit = 600
  const isFullscreen = useMediaQuery(`(max-width:${desktopScreenWidthLimit}px)`)

  return (
    <>
      <Dialog
        open={cardOpen}
        transitionDuration={100}
        fullScreen={isFullscreen}
        onClose={() => setCardOpen(false)}
        aria-labelledby="Card Overlay"
        aria-describedby="Card Overlay"
      >
        <div className={styles.cardDialogContentContainer}>{cardContent}</div>
      </Dialog>
      <h1 style={{ color: board?.styles.textColor }}>{`${board.name}`}</h1>
      <Sections boardId={board.id} sections={board.sections} openCard={openCard} closeCard={() => setCardOpen(false)} />
      {/*<InlineAddButton
          title="+ Add Card"
          addButtonLabel="Add Card"
          placeholder="Name for new card"
          addAction={addCard}
        />*/}
    </>
  )
}

function Sections(props: {
  boardId: Id
  sections: Section[]
  openCard: (content: ReactNode) => void
  closeCard: () => void
}) {
  const allCards = props.sections.flatMap((section) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cards, ...displaySection } = section

    return section.cards.map((card) => {
      return { card, section: displaySection }
    })
  })

  const [currentCardIndex, setCurrentCardIndex] = useState<number | undefined>(undefined)

  const closeCard = () => {
    setCurrentCardIndex(undefined)
    props.closeCard()
  }

  const openCard = (index: number) => {
    const { card, section } = allCards[index]
    const content = cardContent(card, section, props.boardId, closeCard)

    setCurrentCardIndex(index)
    props.openCard(content)
  }

  const moveToPrev = useKeyPress('ArrowLeft')
  const moveToNext = useKeyPress('ArrowRight')

  useEffect(() => {
    if (moveToPrev) {
      if (currentCardIndex !== undefined) {
        const newIndex = currentCardIndex - 1

        if (newIndex >= 0) {
          openCard(newIndex)
        }
      }
    }

    if (moveToNext) {
      if (currentCardIndex !== undefined) {
        const newIndex = currentCardIndex + 1

        if (newIndex < allCards.length) {
          openCard(newIndex)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveToPrev, moveToNext])

  let i = 0

  return (
    <>
      {props.sections.map((section) => (
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
                    openCard(index)
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

const cardContent = (card: ModelCard, section: DisplaySection, boardId: string, closeCard: () => void) => {
  return (
    <CardContent
      boardId={boardId}
      cardId={card.id}
      name={card.name}
      close={closeCard}
      sectionName={section.name}
      sectionTitleColor={section.textColor}
      sectionBackgroundColor={section.backgroundColor}
    />
  )
}

interface DisplaySection {
  name: string
  textColor?: string
  backgroundColor?: string
}
