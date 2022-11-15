/* eslint-disable prettier/prettier */
import Head from 'next/head'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import HeaderAnimated from '@holi/web/components/navigation/HeaderAnimated'

import donationsLayoutStyles from './NavigationLayoutDonationsApp.module.scss'
import sharedLayoutStyles from './NavigationLayoutRoot.module.scss'

const mergedStyles = { ...sharedLayoutStyles, ...donationsLayoutStyles }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppLayout: React.FunctionComponent = ({ children }: PropsWithChildren<any>) => {
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>{t('donations:app.name')}</title>
      </Head>

      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header className={mergedStyles.header}>
        <HeaderAnimated />
      </header>

      <main className={mergedStyles.main}>{children}</main>
    </>
  )
}
