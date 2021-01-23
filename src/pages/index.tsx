import Scaffold from 'components/scaffold'
import Link from 'next/link'
import { useFetchBoards } from '../components/board/useFetchBoard'
import styles from './home.module.scss'

export default function HomePage() {
  const fetch = useFetchBoards()

  return (
    <Scaffold title="Pintra" loginRedirect="/">
      <main className={styles.main}>
        <h1>Boards</h1>
        <ul>
          {fetch.data?.map((board) => (
            <li key={board.id}>
              <Link href={`/b/${board.id}/`}>
                <a>{board.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </Scaffold>
  )
}
