import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { WebView, WebViewNavigation } from 'react-native-webview'

export type HoliWebViewProps = {
  uri: string
  style?: StyleProp<ViewStyle>
}

// TODO HOLI-3662: only works on mobile > move to ui package anyways?
const HoliWebView: React.VFC<HoliWebViewProps> = ({ uri, style }) => {
  // TODO HOLI-3662: handle loading, errors etc.
  const handleWebViewNavigationStateChange = (event: WebViewNavigation) => {
    console.debug(event.url)
  }

  return (
    <WebView
      style={style}
      source={{ uri }}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      onError={(e) => console.error(e)}
    />
  )
}

export default HoliWebView
