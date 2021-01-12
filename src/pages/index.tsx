import Scaffold from 'components/scaffold'
import styles from './home.module.scss'
import { ReactNode, useState } from 'react'
import { Dialog } from '@material-ui/core'

export default function HomePage() {
  const [dialogContent, setDialogContent] = useState<ReactNode>()
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const openDialog = (content: ReactNode) => {
    setDialogContent(content)
    handleOpen()
  }

  return (
    <Scaffold title="Pintra">
      <main className={styles.main}>
        <h1>Resources</h1>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={styles.dialogContentContainer}>{dialogContent}</div>
        </Dialog>
        <section className={styles.cards}>
          <Card title="Vacation Image 01" openDialog={openDialog}>
            <p>
              TUX re-inventing the wheel, and move the needle. Feature creep dogpile that but diversify kpis but
              market-facing.
            </p>
          </Card>

          <Card title="Vacation Image 02" openDialog={openDialog}>
            <p>
              Staff engagement synergize productive mindfulness and waste of resources cross sabers, or forcing function
              shotgun approach drink the Kool-aid.
            </p>
            <p>
              Execute are we in agreeance what do you feel you would bring to the table if you were hired for this
              position, nor closer to the metal goalposts, are there any leftovers in the kitchen?.
            </p>
          </Card>

          <Card title="Vacation Image 03" openDialog={openDialog}>
            <p>
              Viral engagement anti-pattern back of the net, for meeting assassin horsehead offer. Loop back design
              thinking drop-dead date.{' '}
            </p>
          </Card>

          <Card title="Vacation Image 04" openDialog={openDialog}>
            <p>
              We need a paradigm shift get all your ducks in a row. I just wanted to give you a heads-up we need
              distributors to evangelize the new line to local markets when does this sunset? so waste of resources, yet
              fire up your browser, or touch base closing these latest prospects is like putting socks on an octopus.
            </p>
          </Card>

          <Card title="Vacation Image 01" openDialog={openDialog}>
            <p>
              TUX re-inventing the wheel, and move the needle. Feature creep dogpile that but diversify kpis but
              market-facing.
            </p>
          </Card>

          <Card title="Vacation Image 02" openDialog={openDialog}>
            <p>
              Staff engagement synergize productive mindfulness and waste of resources cross sabers, or forcing function
              shotgun approach drink the Kool-aid.
            </p>
            <p>
              Execute are we in agreeance what do you feel you would bring to the table if you were hired for this
              position, nor closer to the metal goalposts, are there any leftovers in the kitchen?.
            </p>
          </Card>

          <Card title="Vacation Image 03" openDialog={openDialog}>
            <p>
              Viral engagement anti-pattern back of the net, for meeting assassin horsehead offer. Loop back design
              thinking drop-dead date.{' '}
            </p>
          </Card>

          <Card title="Vacation Image 04" openDialog={openDialog}>
            <p>
              We need a paradigm shift get all your ducks in a row. I just wanted to give you a heads-up we need
              distributors to evangelize the new line to local markets when does this sunset? so waste of resources, yet
              fire up your browser, or touch base closing these latest prospects is like putting socks on an octopus.
            </p>
          </Card>
        </section>
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
    <article className={styles.card} onClick={() => openDialog(children)}>
      <div>
        <h2>{title}</h2>
      </div>
      {children}
    </article>
  )
}

function Markdown({ content }: { content: string }) {
  const renderedContent = MarkdownIt({ html: false, linkify: true }).render(content)
  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
}
