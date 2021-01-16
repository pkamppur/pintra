import { Dialog } from '@material-ui/core'
import { groups } from 'components/items'
import Scaffold from 'components/scaffold'
import MarkdownIt from 'markdown-it'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import styles from './board.module.scss'

export default function Board() {
  const [dialogContent, setDialogContent] = useState<ReactNode>()
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const openDialog = (content: ReactNode) => {
    setDialogContent(content)
    setOpen(true)
  }

  const board = { name: 'BoardName' }

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

        <div>{JSON.stringify(router.query)}</div>

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
