import React from 'react'
import Head from 'next/head'
import { Drawer } from '@holi/web/components/drawer'
import styles from './layout.module.scss'

const Layout: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>HOLI - PrivateSpace</title>
      </Head>
      <Drawer />
      <main className={styles.main}>{children}</main>
    </>
  )
}

export default Layout
