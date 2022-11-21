import Head from 'next/head'
import React from 'react'
import { useTranslation } from 'react-i18next'

import FooterTabBar from '@holi/web/components/navigation/FooterTabBar'
import HeaderAnimated from '@holi/web/components/navigation/HeaderAnimated'

import navigationLayoutRootStyles from './NavigationLayoutRoot.module.scss'

const DefaultLayout: React.FunctionComponent = ({ children }) => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('navigation.title')}</title>
      </Head>

      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header className={navigationLayoutRootStyles.header}>
        <HeaderAnimated />
      </header>

      <main className={navigationLayoutRootStyles.main}>{children}</main>

      <footer className={navigationLayoutRootStyles.footer}>
        <div className={navigationLayoutRootStyles.footerInner}>
          <FooterTabBar />
        </div>
      </footer>
    </>
  )
}

export default DefaultLayout
