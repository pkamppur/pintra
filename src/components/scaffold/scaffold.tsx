import { ReactNode } from 'react'
import Head from 'next/head'

import Navigation from 'components/navigation'
import styles from './scaffold.module.scss'

interface ScaffoldProps {
  title: string
  loginRedirect: string
  children: ReactNode
}

export default function Scaffold({ title, loginRedirect: path, children }: ScaffoldProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <style global jsx>{`
        html,
        body,
        #__next {
          height: 100%;
        }
        body {
          font-family: 'Avenir', sans-serif;
          margin: 0;
        }
      `}</style>{' '}
      <Navigation loginRedirect={path} />
      <div className={styles.scaffoldContainer}>{children}</div>
    </>
  )
}
