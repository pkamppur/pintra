import Scaffold from 'components/scaffold'
import styles from './home.module.scss'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Scaffold title="Pintra">
      <main className={styles.main}>
        <h1>Boards</h1>
        <ul>
          <li>
            <Link href="/b/username/board">
              <a>Board</a>
            </Link>
          </li>
        </ul>
      </main>
    </Scaffold>
  )
}
