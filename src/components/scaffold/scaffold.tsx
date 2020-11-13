import { ReactNode } from 'react'
import Head from 'next/head'

import Navigation from 'components/navigation'
import styles from './scaffold.module.scss'

export default function Scaffold({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <style global jsx>{`
        html,
        body {
          height: 100%;
        }
        body {
          font-family: 'Avenir', sans-serif;
          margin: 0;
        }
      `}</style>{' '}
      <Navigation />
      <div className={styles.scaffoldContainer}>{children}</div>
    </>
  )
}
