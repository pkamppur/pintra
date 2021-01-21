import { ChangeEvent, MouseEvent, useState } from 'react'
import styles from './inline-add-button.module.scss'

interface InlineAddButtonProps {
  title: string
  addButtonLabel: string
  placeholder: string
  addAction: (name: string) => void
}

export default function InlineAddButton({ title, addButtonLabel, placeholder, addAction }: InlineAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false)

  let textareaNode: HTMLTextAreaElement | null

  function cancelAdding(e: MouseEvent) {
    e.preventDefault()
    setIsAdding(false)
  }

  function showTextField(e: MouseEvent) {
    e.preventDefault()
    setIsAdding(true)

    setTimeout(function () {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  function performAdd() {
    if (textareaNode?.value) {
      addAction(textareaNode.value)
      textareaNode.value = ''
      setIsAdding(false)
    } else {
      textareaNode?.focus()
    }
  }

  if (isAdding) {
    return (
      <div className={styles.addContainer}>
        <div>
          <textarea
            className={styles.composerTextarea}
            dir="auto"
            placeholder={placeholder}
            ref={(node) => (textareaNode = node)}
          />
        </div>
        <div>
          <input type="submit" value={addButtonLabel} className={styles.addActionButton} onClick={performAdd} />

          <a href="#" className={styles.cancelButton} onClick={cancelAdding}>
            ×
          </a>
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.addContainer}>
        <a href="#" className={styles.showTextFieldButton} onClick={showTextField}>
          {title}
        </a>
      </div>
    )
  }
}
