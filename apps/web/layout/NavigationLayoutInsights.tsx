import Head from 'next/head'
import React from 'react'
import { useTranslation } from 'react-i18next'

import HeaderAnimated from '@holi/web/components/navigation/HeaderAnimated'

import navigationLayoutInsightsStyles from './NavigationLayoutInsights'

const InsightsLayout: React.FC = ({ children }) => {
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
      <header className={navigationLayoutInsightsStyles.header}>
        <HeaderAnimated />
      </header>

      <main className={navigationLayoutInsightsStyles.main}>{children}</main>
    </>
  )
}

export default InsightsLayout
