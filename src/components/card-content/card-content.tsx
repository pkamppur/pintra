import MarkdownIt from 'markdown-it'
import { ReactNode } from 'react'
import { Id } from '../../shared/board/model'
import { useFetchCardContent } from '../board/useFetchBoard'

export default function CardContent({ boardId, cardId, name }: { boardId: Id; cardId: Id; name: string }) {
  const { loading, data, error } = useFetchCardContent(boardId, cardId)

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
      <h2>{name}</h2>
      {contentNode}
    </>
  )
}

function Markdown({ content }: { content: string }) {
  const renderedContent = MarkdownIt({ html: false, linkify: true }).render(content)
  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
}
