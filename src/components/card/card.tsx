import { ReactNode } from 'react'
import { Tag } from 'shared/board/model'
import styles from './card.module.scss'

export interface CardProps {
  title: string
  tags: Tag[]
  openDialog: (content: ReactNode) => void
  children: ReactNode
}

export default function Card({ title, tags, openDialog, children }: CardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card} onClick={() => openDialog(children)}>
        <div>
          <div>{title}</div>
          <div className={styles.tags}>
            {tags.map((tag) => (
              <div
                key={tag.id}
                style={{ color: tag.textColor, backgroundColor: tag.backgroundColor }}
                className={styles.tag}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
