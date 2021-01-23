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
  console.log(`Card ${title}, tags = ${JSON.stringify(tags)}`)
  return (
    <div>
      <div className={styles.card} onClick={() => openDialog(children)}>
        <div>
          <div>{title}</div>
          <div>
            {tags.map((tag) => (
              <div key={tag.id} className={styles.tag}>
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
