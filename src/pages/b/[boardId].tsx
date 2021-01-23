import { Dialog } from '@material-ui/core'
import Scaffold from 'components/scaffold'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { BoardContent, Id, Section } from 'shared/board/model'
import { useFetchBoardContent } from 'components/board/useFetchBoard'
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

  const content = BoardPageContent({ boardId, loading, data, error })

  const navBarItems = SearchBox()

  return (
    <Scaffold title={content.title} loginRedirect={router.asPath} additionalNavComponent={navBarItems}>
      <main className={styles.main}>{content.content}</main>
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
  const [dialogContent, setDialogContent] = useState<ReactNode>()
  const [open, setOpen] = useState(false)

  const openDialog = (content: ReactNode) => {
    setDialogContent(content)
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
        <div className={styles.dialogContentContainer}>{dialogContent}</div>
      </Dialog>
      <h1>{`${board.name}`}</h1>
      <Sections boardId={board.id} sections={board.sections} openDialog={openDialog} />
      <InlineAddButton
        title="+ Add Card"
        addButtonLabel="Add Card"
        placeholder="Name for new card"
        addAction={addCard}
      />
    </>
  )
}

function Sections({
  boardId,
  sections,
  openDialog,
}: {
  boardId: Id
  sections: Section[]
  openDialog: (content: ReactNode) => void
}) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.id}>
          <div className={styles.sectionDivider}>{section.name}</div>
          <section className={styles.cards}>
            {section.cards.map((card) => (
              <Card key={card.id} title={card.name} openDialog={openDialog}>
                <CardContent boardId={boardId} cardId={card.id} name={card.name} />
              </Card>
            ))}
          </section>
        </div>
      ))}
    </>
  )
}
