import { ReactNode } from 'react'
import styles from './card.module.scss'

export interface CardProps {
  title: string
  openDialog: (content: ReactNode) => void
  children: ReactNode
}

export default function Card({ title, openDialog, children }: CardProps) {
  return (
    <div>
      <div className={styles.card} onClick={() => openDialog(children)}>
        <div>
          <div>{title}</div>
        </div>
      </div>
    </div>
  )
}
