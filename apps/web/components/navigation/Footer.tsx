import React from 'react'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import FooterTabBar from '@holi/web/components/navigation/FooterTabBar'

const Footer: React.VoidFunctionComponent = ({ className }) => {
  const { options } = useUnifiedNavigation()
  if (options.navigationCustomOptions?.footerShown === false) {
    return <></>
  }

  return (
    <footer className={className}>
      <FooterTabBar />
    </footer>
  )
}

export default Footer
