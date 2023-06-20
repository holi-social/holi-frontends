import React from 'react'

import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import FooterTabBar from '@holi/web/components/navigation/FooterTabBar'

const Footer = ({ className }: { className: string }) => {
  const options = useScreenOptions()

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
