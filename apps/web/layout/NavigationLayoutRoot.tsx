import Head from 'next/head'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@holi/ui/styles/theme'
import HomeButtonBar from '@holi/web/components/navigation/HomeBottomBar'
import HomeTopBar from '@holi/web/components/navigation/HomeTopBar'

import navigationLayoutRootStyles from './NavigationLayoutRoot.module.scss'

const DefaultLayout: React.FunctionComponent = ({ children }) => {
  const { t } = useTranslation()
  const { modalIsOpen } = useTheme()

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
        <HomeTopBar />
      </header>

      <main className={`${navigationLayoutRootStyles.main} ${modalIsOpen ? navigationLayoutRootStyles.fixed : ''}`}>
        {children}
      </main>

      <footer className={navigationLayoutRootStyles.footer}>
        <HomeButtonBar />
      </footer>
    </>
  )
}

export default DefaultLayout
