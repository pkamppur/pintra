import { Dialog } from '@material-ui/core'
import Scaffold from 'components/scaffold'
import { useRouter } from 'next/router'
import { MouseEvent, ReactNode, useState } from 'react'
import { Board, Id } from 'shared/board/model'
import { useFetchBoard, useFetchSections } from 'components/board/useFetchBoard'
import { GetServerSideProps } from 'next'
import { asString } from 'components/stringHelpers'
import CardContent from 'components/card-content/card-content'
import Card from 'components/card/card'
import styles from './board.module.scss'

export default function BoardPage() {
  const router = useRouter()

  const rawBoardId = router.query.boardId
  const boardId = asString(rawBoardId)

  const { loading, data, error } = useFetchBoard(boardId)

  const content = BoardPageContent({ boardId, loading, data, error })

  return (
    <Scaffold title={content.title} loginRedirect={router.asPath}>
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
  data?: Board
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

function BoardContents({ board }: { board: Board }) {
  const [dialogContent, setDialogContent] = useState<ReactNode>()
  const [open, setOpen] = useState(false)

  const openDialog = (content: ReactNode) => {
    setDialogContent(content)
    setOpen(true)
  }

  function addSection(e: MouseEvent) {
    e.preventDefault()
    console.log('The link was clicked.')
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
      <Sections boardId={board.id} openDialog={openDialog} />
      <div>
        <a href="#" className={styles.sectionButton} onClick={addSection}>
          + Add section
        </a>
      </div>
    </>
  )
}

function Sections({ boardId, openDialog }: { boardId: Id; openDialog: (content: ReactNode) => void }) {
  const { loading, data, error } = useFetchSections(boardId)

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }
  if (loading || !data) {
    return <div>Loading…</div>
  }
  const sections = data

  return (
    <>
      {sections.map((section) => (
        <>
          <div className={styles.sectionDivider}>{section.name}</div>
          <section key={section.id} className={styles.cards}>
            {section.cards.map((card) => (
              <Card key={card.id} title={card.name} openDialog={openDialog}>
                <CardContent boardId={boardId} cardId={card.id} name={card.name} />
              </Card>
            ))}
          </section>
        </>
      ))}
    </>
  )
}
