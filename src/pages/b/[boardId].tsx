import { Dialog } from '@material-ui/core'
import Scaffold from 'components/scaffold'
import MarkdownIt from 'markdown-it'
import { useRouter } from 'next/router'
import { MouseEvent, ReactNode, useState } from 'react'
import { Board, Id, Section } from 'shared/board/model'
import useFetchBoard from 'components/board/useFetchBoard'
import styles from './board.module.scss'
import dynamic from 'next/dynamic'

function asString(value: unknown): string | undefined {
  if (typeof value === 'string' || value instanceof String) {
    return value as string
  } else {
    return undefined
  }
}

export default function BoardPage() {
  const router = useRouter()

  const rawBoardId = router.query.boardId
  const boardId = asString(rawBoardId)

  const { loading, data, error } = useFetchBoard(boardId)

  const content = BoardPageContent({ boardId, loading, data, error })

  return (
    <Scaffold title={content.title}>
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
      <Sections openDialog={openDialog} />
      <div>
        <a href="#" className={styles.sectionButton} onClick={addSection}>
          + Add section
        </a>
      </div>
    </>
  )
}

function Sections({ openDialog }: { openDialog: (content: ReactNode) => void }) {
  const sections: Section[] = []
  return (
    <>
      {sections.map((section) => (
        <>
          <div className={styles.sectionDivider}>{section.name}</div>
          <section className={styles.cards}>
            {section.cards.map((card) => (
              <Card title={card.title} key={card.id} openDialog={openDialog}>
                <h2>{card.title}</h2>
                <Markdown content={card.content} />
              </Card>
            ))}
          </section>
        </>
      ))}
    </>
  )
}

function Card({
  title,
  openDialog,
  children,
}: {
  title: string
  openDialog: (content: ReactNode) => void
  children: ReactNode
}) {
  return (
    <div>
      <div className={styles.card} onClick={() => openDialog(children)}>
        <div>
          <div>{title}</div>
        </div>
        <div className={styles.markdownContent}>{children}</div>
      </div>
    </div>
  )
}

function Markdown({ content }: { content: string }) {
  const renderedContent = MarkdownIt({ html: false, linkify: true }).render(content)
  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
}
