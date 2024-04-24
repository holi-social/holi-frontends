import { RefObject } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'

import { HoliTheme } from '@holi/ui/styles/theme'

export interface HoliWebViewProps {
  style?: StyleProp<ViewStyle>
  theme: HoliTheme
  webViewProps: WebViewProps // contains source
  navigateToExternalBrowser?: boolean
  // enables support for back gesture in webview android & iOS (https://github.com/react-native-webview/react-native-webview/issues/2466)
  allowsBackForwardNavigationGesturesMultiOS?: boolean
  webViewRef?: RefObject<WebView>
}
