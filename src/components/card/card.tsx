import { ReactNode } from 'react'
import { Tag } from 'shared/board/model'
import styles from './card.module.scss'

export interface CardProps {
  title: string
  tags: Tag[]
  openCard: (content: ReactNode) => void
  children: ReactNode
}

export default function Card({ title, tags, openCard, children }: CardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card} onClick={() => openCard(children)}>
        <div>
          <div>{title}</div>
          {<CardTagList tags={tags} />}
        </div>
      </div>
    </div>
  )
}

function CardTagList({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) {
    return <></>
  }

  return (
    <div className={styles.tags}>
      {tags.map((tag) => (
        <div key={tag.id} style={{ color: tag.textColor, backgroundColor: tag.backgroundColor }} className={styles.tag}>
          {tag.name}
        </div>
      ))}
    </div>
  )
}
