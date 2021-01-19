import Link from 'next/link'
import styles from './navigation.module.scss'

export default function Navigation() {
  return (
    <>
      <header className={styles.header}>
        <Link href="/">
          <a className={styles.navLink}>
            <figure className={styles.brand}>Pintra</figure>
          </a>
        </Link>
        <NavBar />
      </header>
      <div className={styles.padding}></div>
    </>
  )
}

function NavBar() {
  return (
    <>
      {/*<nav className={styles.menu}>
      <input type="checkbox" id="menuToggle" className={styles.menuToggle} />
      <label htmlFor="menuToggle" className={styles.menuIconLabel}>
        <i className={styles.menuIcon}></i>
      </label>
      <ul>
        {<li>
          <Link href="/somepage/">
            <a className={styles.navLink}>Some page</a>
          </Link>
        </li>}
      </ul>
        </nav>*/}
      <div className={styles.rightNav}>
        <Link href="/login/">
          <a className={styles.navLink}>Login</a>
        </Link>
      </div>
    </>
  )
}
