import Head from 'next/head'
import React from 'react'

import HomeButtonBar from '@holi/web/components/navigation/HomeBottomBar'
import HomeTopBar from '@holi/web/components/navigation/HomeTopBar'

import pageLayoutStyles from './PageLayout.module.scss'

const DefaultLayout: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <Head>
        <title>Holi Project</title>
      </Head>

      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header className={pageLayoutStyles.header}>
        <HomeTopBar />
      </header>

      <main className={pageLayoutStyles.main}>{children}</main>

      <footer className={pageLayoutStyles.footer}>
        <HomeButtonBar />
      </footer>
    </>
  )
}

export default DefaultLayout
