import React from 'react'
import { useTranslation } from 'react-i18next'

import HeaderAnimated from '@holi/core/components/HeaderAnimated'
import HoliHead from '@holi/core/components/HoliHead'

import sharedLayoutStyles from './NavigationLayoutRoot.module.css'
import volunteeringLayoutStyles from './NavigationLayoutVolunteeringApp.module.css'

const mergedStyles = { ...sharedLayoutStyles, ...volunteeringLayoutStyles }

export const AppLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation()
  return (
    <>
      <HoliHead
        title={t('metatags.volunteering.title')}
        description={t('metatags.volunteering.description')}
        ogTitle={t('metatags.volunteering.og.title')}
        ogDescription={t('metatags.volunteering.og.description')}
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
