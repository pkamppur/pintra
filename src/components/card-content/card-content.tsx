import MarkdownIt from 'markdown-it'
import { ReactNode } from 'react'
import { Id } from 'shared/board/model'
import { useFetchCardContent } from 'components/board/useFetchBoard'
import styles from './card-content.module.scss'

interface CardContentProps {
  boardId: Id
  cardId: Id
  name: string
  sectionName: string
  sectionTitleColor?: string
  sectionBackgroundColor?: string
}

export default function CardContent(props: CardContentProps) {
  const { loading, data, error } = useFetchCardContent(props.boardId, props.cardId)

  let contentNode: ReactNode
  if (error) {
    contentNode = <div>Error: {JSON.stringify(error)}</div>
  } else if (loading || !data) {
    contentNode = <div>Loading…</div>
  } else {
    contentNode = <Markdown content={data.content} />
  }

  return (
    <>
      <div
        className={styles.cardHeader}
        style={{ color: props.sectionTitleColor, backgroundColor: props.sectionBackgroundColor }}
      >
        <h2>{props.name}</h2>
      </div>
      <div className={styles.cardContent}>{contentNode}</div>
    </>
  )
}

function Markdown({ content }: { content: string }) {
  const renderedContent = MarkdownIt({ html: false, linkify: true }).render(content)
  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
}
