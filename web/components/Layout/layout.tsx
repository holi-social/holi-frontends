import Reaect from 'react'
import Footer from '../Footer'
import Nav from '../nav'
import Head from 'next/head'
import styles from './layout.module.scss'
import React from 'react'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>HOLI - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
