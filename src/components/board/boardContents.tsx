import { ReactNode, useState } from 'react'
import { Dialog } from '@material-ui/core'
import { BoardContent, Card as ModelCard, Id, Section } from 'shared/board/model'
import CardContent from 'components/card-content/card-content'
import Card from 'components/card/card'
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

  return (
    <>
      <Dialog
        open={cardOpen}
        transitionDuration={100}
        onClose={() => setCardOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div>{cardContent}</div>
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
              return (
                <Card
                  key={card.id}
                  title={card.name}
                  tags={card.tags}
                  openCard={() => {
                    props.openCard(cardContent(card, section, props.boardId, props.closeCard))
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
