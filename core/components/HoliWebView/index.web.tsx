import React from 'react'
import type { WebViewSourceUri } from 'react-native-webview/src/WebViewTypes'

import { HoliWebViewProps } from '@holi/core/components/HoliWebView/types'

// Should not be used on web
const HoliWebView: React.FC<HoliWebViewProps> = ({ webViewProps }) => {
  // Directly redirect to the uri instead of rendering anything
  window.location.href = (webViewProps?.source as WebViewSourceUri)?.uri
  return null
}

export default HoliWebView
