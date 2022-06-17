import Head from 'next/head'
import React from 'react'

import HomeButtonBar from '@holi/core/navigation/components/web/HomeBottomBar'
import HomeTopBar from '@holi/core/navigation/components/web/HomeTopBar'

import defaultStyles from './DefaultLayout.module.scss'

const DefaultLayout: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>HOLI</title>
      </Head>

      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header className={defaultStyles.header}>
        <HomeTopBar />
      </header>

      <main className={defaultStyles.main}>{children}</main>

      <footer className={defaultStyles.footer}>
        <HomeButtonBar />
      </footer>
    </>
  )
}

export default DefaultLayout
