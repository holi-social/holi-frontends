import type React from 'react'
import { useTranslation } from 'react-i18next'

import HoliHead from '@holi/core/components/HoliHead'

import donationsLayoutStyles from './NavigationLayoutDonationsApp.module.css'
import sharedLayoutStyles from './NavigationLayoutRoot.module.css'

const mergedStyles = { ...sharedLayoutStyles, ...donationsLayoutStyles }

export const AppLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation()

  return (
    <>
      <HoliHead
        title={t('metatags.donations.title')}
        description={t('metatags.donations.description')}
        ogTitle={t('metatags.donations.og.title')}
        ogDescription={t('metatags.donations.og.description')}
      />
      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header>
        <HeaderAnimated web />
      </header>

      <main className={mergedStyles.main}>{children}</main>
    </>
  )
}
