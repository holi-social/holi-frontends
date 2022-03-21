import React from 'react'
import Head from 'next/head'

import Footer from '../Footer'
import Nav from '../nav'
import styles from './layout.module.scss'
import { DrawerHeader } from 'shared/navigation/drawer'
import { Drawer } from 'web/components/drawer'

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
