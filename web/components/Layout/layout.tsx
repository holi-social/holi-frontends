import React from 'react'
import Head from 'next/head'

import { DrawerHeaderBase } from 'shared/components/navigation/DrawerHeader/DrawerHeaderBase'

import Footer from '../Footer'
import Nav from '../nav'
import styles from './layout.module.scss'
import { Drawer } from 'shared/navigation/drawer'

// because this layout contains Drawer and Header, should it live in the navigationprovider for web?
const Layout: React.FunctionComponent = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  return (
    <>
      <Head>
        <title>HOLI - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <DrawerHeaderBase toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
