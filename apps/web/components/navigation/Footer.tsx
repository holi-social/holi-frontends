import React from 'react'

import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import FooterTabBar from '@holi/web/components/navigation/FooterTabBar'

interface FooterProps {
  className: string
  contentClassName: string
}

const Footer = ({ className, contentClassName }: FooterProps) => {
  const options = useScreenOptions()

  if (options.navigationCustomOptions?.footerShown === false) {
    return null
  }

  return (
    <footer className={className}>
      <div className={contentClassName}>
        <FooterTabBar />
      </div>
    </footer>
  )
}

export default Footer
