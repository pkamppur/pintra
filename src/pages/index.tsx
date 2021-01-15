import Scaffold from 'components/scaffold'
import styles from './home.module.scss'
import { ReactNode, useState } from 'react'
import { Dialog, Popover } from '@material-ui/core'
import MarkdownIt from 'markdown-it'
import { groups } from '../components/items'

export default function HomePage() {
  const [dialogContent, setDialogContent] = useState<ReactNode>()
  const [open, setOpen] = useState(false)

  const openDialog = (content: ReactNode) => {
    setDialogContent(content)
    setOpen(true)
  }

  return (
    <Scaffold title="Pintra">
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
      <article className={styles.card} onClick={() => openDialog(children)}>
        <div>
          <div>{title}</div>
        </div>
        <div className={styles.markdownContent}>{children}</div>
      </article>
    </div>
  )
}

function Markdown({ content }: { content: string }) {
  const renderedContent = MarkdownIt({ html: false, linkify: true }).render(content)
  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
}
