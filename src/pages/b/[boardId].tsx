import { Dialog } from '@material-ui/core'
import Scaffold from 'components/scaffold'
import MarkdownIt from 'markdown-it'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { Group } from 'components/board/model'
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

export default function Board() {
  const [dialogContent, setDialogContent] = useState<ReactNode>()
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const openDialog = (content: ReactNode) => {
    setDialogContent(content)
    setOpen(true)
  }

  const rawBoardId = router.query.boardId
  const boardId = asString(rawBoardId)

  const { loading, data, error } = useFetchBoard(boardId)

  if (error) {
    return (
      <Scaffold title={`${boardId} - error | Pintra`}>
        <div>failed to load {JSON.stringify(error)}</div>
      </Scaffold>
    )
  }

  if (loading || !data) {
    return (
      <Scaffold title={`Loading ${boardId} | Pintra`}>
        <main className={styles.main}>
          <div>Loading…</div>
        </main>
      </Scaffold>
    )
  }

  const board = data
  const groups: Group[] = []

  return (
    <Scaffold title={`${board.name} | Pintra`}>
      <main className={styles.main}>
        <Dialog
          open={open}
          transitionDuration={100}
          onClose={() => setOpen(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={styles.dialogContentContainer}>{dialogContent}</div>
        </Dialog>

        <h1>Resources</h1>
        {groups.map((group) => (
          <>
            <div className={styles.sectionDivider}>{group.title}</div>
            <section className={styles.cards}>
              {group.items.map((item) => (
                <Card title={item.title} key={item.id} openDialog={openDialog}>
                  <h2>{item.title}</h2>
                  <Markdown content={item.content} />
                </Card>
              ))}
            </section>
          </>
        ))}
      </main>
    </Scaffold>
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
