import React from 'react'
import Head from 'next/head'

import { DrawerHeader } from 'shared/navigation/drawer'

import Nav from 'web/components/nav'
import Footer from 'web/components/Footer'
import { Drawer } from 'web/components/drawer'
import styles from './layout.module.scss'

// Should it live in NavigationProvider for web, because this layout contains navigation elements like Drawer and DrawerHeader?
const Layout: React.FunctionComponent = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  return (
    <>
      <Head>
        <title>HOLI - Home</title>
      </Head>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <DrawerHeader toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
