import { ChangeEvent, useState } from 'react'
import styles from './searchbox.module.scss'

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('')

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    console.log(`search for ${searchTerm}`)
  }

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        value={searchTerm}
        onChange={onInputChange}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        type="search"
      />
    </div>
  )
}
