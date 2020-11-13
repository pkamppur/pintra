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
    <nav className={styles.menu}>
      <input type="checkbox" id="menuToggle" className={styles.menuToggle} />
      <label htmlFor="menuToggle" className={styles.menuIconLabel}>
        <i className={styles.menuIcon}></i>
      </label>
      <ul>
        {/*<li>
          <Link href="/spellbookmaster/ios/">
            <a className={styles.navLink}>SpellbookMaster</a>
          </Link>
        </li>*/}
        {/*<li>
          <Link href="/other-projects/">
            <a className={styles.navLink}>Other Projects</a>
          </Link>
        </li>*/}
        {/*<li>
          <Link href="/rahastot">
            <a className={styles.navLink}>Rahastot</a>
          </Link>
        </li>*/}
        {/*<li>
          <Link href="/resume/">
            <a className={styles.navLink}>Resume</a>
          </Link>
        </li>*/}
      </ul>
    </nav>
  )
}
