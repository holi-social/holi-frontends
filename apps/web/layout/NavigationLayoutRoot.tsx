import React from 'react'

import Footer from '@holi/web/components/navigation/Footer'
import HeaderAnimated from '@holi/web/components/navigation/HeaderAnimated'

import navigationLayoutRootStyles from './NavigationLayoutRoot.module.css'

const NavigationLayoutRoot = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <>
      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header className={navigationLayoutRootStyles.header}>
        <HeaderAnimated />
      </header>

      <main className={navigationLayoutRootStyles.main}>{children}</main>

      <Footer className={navigationLayoutRootStyles.footer} />
    </>
  )
}

export default NavigationLayoutRoot
