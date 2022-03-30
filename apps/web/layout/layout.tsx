import React from 'react'
import Head from 'next/head'
import { DrawerHeader } from '@holi/shared/features/spaces/navigation/header'
import { Drawer } from '@holi/web/components/drawer'
import styles from './layout.module.scss'

const Layout: React.FunctionComponent = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  return (
    <>
      <Head>
        <title>HOLI - PrivateSpace</title>
      </Head>
      <DrawerHeader toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className={styles.main}>{children}</main>
    </>
  )
}

export default Layout
