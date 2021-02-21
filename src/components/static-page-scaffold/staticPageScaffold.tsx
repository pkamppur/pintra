import Head from 'next/head'
import { ReactNode } from 'react'
import styles from './static-page-scaffold.module.scss'

export function StaticPageScaffold({
  title,
  topBarItem,
  children,
}: {
  title: string
  topBarItem: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <style global jsx>{`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: -apple-system, sans-serif;
        }
        html,
        body,
        #__next {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        body {
          font-family: 'Avenir', sans-serif;
          margin: 0;
        }
      `}</style>
      <div className={styles.scaffoldContainer}>
        <div className={styles.topBarContainer}>
          <h1>{title}</h1>
          <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>{topBarItem}</div>
        </div>
        {children}
      </div>
    </>
  )
}
