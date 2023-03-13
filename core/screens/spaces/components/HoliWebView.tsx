import React from 'react'
import { WebView, WebViewNavigation } from 'react-native-webview'

import { HoliWebViewProps } from '@holi/core/screens/spaces/components/HoliWebView.shared'

const HoliWebView: React.VFC<HoliWebViewProps> = ({ uri, style }) => {
  // TODO(SF) handle loading, errors etc.
  const handleWebViewNavigationStateChange = (event: WebViewNavigation) => {
    console.log(event.url)
  }

  return (
    <WebView
      style={style}
      source={{ uri }}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      onError={(e) => console.log(e)}
    />
  )
}

export default HoliWebView
