import MarkdownIt from 'markdown-it'
import { MouseEvent, ReactNode } from 'react'
import { CardContentLoadResult } from '../../shared/board/model'
import styles from './card-content.module.scss'

interface CardContentProps {
  name: string
  contentLoadResult: CardContentLoadResult
  close: () => void
  prev: () => void
  next: () => void
  sectionName: string
  sectionTitleColor?: string
  sectionBackgroundColor?: string
}

export default function CardContent(props: CardContentProps) {
  const { loading, data, error } = props.contentLoadResult

  let contentNode: ReactNode
  if (error) {
    contentNode = <div>Error: {JSON.stringify(error)}</div>
  } else if (loading || !data) {
    contentNode = <div>Loading…</div>
  } else {
    contentNode = <Markdown content={data.content} />
  }

  const onClose = (e: MouseEvent) => {
    e.preventDefault()
    props.close()
  }

  return (
    <>
      <div
        className={styles.cardHeader}
        style={{ color: props.sectionTitleColor, backgroundColor: props.sectionBackgroundColor }}
      >
        <div className={styles.closeButtonContainer}>
          <a
            className={styles.closeButton}
            href="#"
            style={{ color: props.sectionTitleColor ?? '#000' }}
            onClick={onClose}
            aria-labelledby="Close Button"
          >
            ×
          </a>
        </div>
        <h2>{props.name}</h2>
        <div className={styles.navButtonContainer}>
          <a className={styles.navButton} style={{ color: props.sectionTitleColor }} onClick={props.prev}>
            {'<'}
          </a>
          <a className={styles.navButton} style={{ color: props.sectionTitleColor }} onClick={props.next}>
            {'>'}
          </a>
        </div>
      </div>
      <div className={styles.cardContent}>{contentNode}</div>
    </>
  )
}

function Markdown({ content }: { content: string }) {
  const renderedContent = MarkdownIt({ html: false, linkify: true }).render(content)
  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
}
