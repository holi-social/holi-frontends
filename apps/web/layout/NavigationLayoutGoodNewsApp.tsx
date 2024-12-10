import type React from 'react'

import HeaderAnimated from '@holi/core/components/HeaderAnimated'

import goodnewsLayoutStyles from './NavigationLayoutDonationsApp.module.css'
import sharedLayoutStyles from './NavigationLayoutRoot.module.css'

const mergedStyles = { ...sharedLayoutStyles, ...goodnewsLayoutStyles }

export const AppLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <>
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
