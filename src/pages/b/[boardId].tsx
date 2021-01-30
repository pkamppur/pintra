import { Dialog } from '@material-ui/core'
import Scaffold from 'components/scaffold'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { BoardContent, Id, Section } from 'shared/board/model'
import { useFetchBoardContent, useFetchSearch } from 'components/board/useFetchBoard'
import { asString } from 'components/stringHelpers'
import CardContent from 'components/card-content/card-content'
import Card from 'components/card/card'
import InlineAddButton from 'components/inline-add-button/inline-add-button'
import SearchBox from 'components/searchbox/searchbox'
import styles from './board.module.scss'

export default function BoardPage() {
  const router = useRouter()

  const rawBoardId = router.query.boardId
  const boardId = asString(rawBoardId)

  const { loading, data, error } = useFetchBoardContent(boardId)

  const [searchTerm, setSearchTerm] = useState('')

  const searchFetch = useFetchSearch(boardId, searchTerm)

  const navBarItems = SearchBox({ search: setSearchTerm })
  const content = BoardPageContent({ boardId, loading, data: searchFetch.data || data, error })

  return (
    <Scaffold title={content.title} loginRedirect={router.asPath} additionalNavComponent={navBarItems}>
      <main
        className={styles.main}
        style={{
          backgroundColor: data?.styles.backgroundColor,
          background: data?.styles.background,
          backgroundImage: data?.styles.backgroundImage,
          backgroundSize: data?.styles.backgroundImage ? 'cover' : undefined,
        }}
      >
        {content.content}
      </main>
    </Scaffold>
  )
}

function BoardPageContent({
  boardId,
  loading,
  data,
  error,
}: {
  boardId?: Id
  loading: boolean
  data?: BoardContent
  error: unknown
}): { title: string; content: ReactNode } {
  if (error) {
    return { title: `Error Loading: ${boardId} | Pintra`, content: <div>failed to load {JSON.stringify(error)}</div> }
  }

  if (loading || !data) {
    return { title: `Loading ${boardId} | Pintra`, content: <div>Loading…</div> }
  }

  return { title: `${data.name} | Pintra`, content: <BoardContents board={data} /> }
}

function BoardContents({ board }: { board: BoardContent }) {
  const [cardContent, setCardContent] = useState<ReactNode>()
  const [open, setOpen] = useState(false)

  const openCard = (content: ReactNode) => {
    setCardContent(content)
    setOpen(true)
  }

  const addCard = (name: string) => {
    console.log(`addCard ${name}`)
  }

  return (
    <>
      <Dialog
        open={open}
        transitionDuration={100}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={styles.cardContentContainer}>{cardContent}</div>
      </Dialog>
      <h1 style={{ color: board?.styles.textColor }}>{`${board.name}`}</h1>
      <Sections boardId={board.id} sections={board.sections} openCard={openCard} />
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
  boardId,
  sections,
  openCard,
}: {
  boardId: Id
  sections: Section[]
  openCard: (content: ReactNode) => void
}) {
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
            {section.cards.map((card) => (
              <Card key={card.id} title={card.name} tags={card.tags} openCard={openCard}>
                <CardContent boardId={boardId} cardId={card.id} name={card.name} />
              </Card>
            ))}
          </section>
        </div>
      ))}
    </>
  )
}
