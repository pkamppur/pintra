import { ChangeEvent, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import styles from './searchbox.module.scss'

interface SearchBoxProps {
  search: (searchTerm: string) => void
}

export default function SearchBox({ search }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const doSearch = () => {
    search(searchTerm)
  }

  const delayedQuery = debounce(doSearch, 500)

  useEffect(() => {
    delayedQuery()

    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel
  }, [searchTerm, delayedQuery])

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
