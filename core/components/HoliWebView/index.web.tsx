import React from 'react'

import { HoliWebViewProps } from '@holi/core/components/HoliWebView/types'

// Should not be used on web
const HoliWebView: React.FC<HoliWebViewProps> = ({ uri }) => {
  // Directly redirect to the uri instead of rendering anything
  window.location.href = uri
  return null
}

export default HoliWebView
