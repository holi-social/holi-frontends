import { StyleProp, ViewStyle } from 'react-native'
import { WebViewProps } from 'react-native-webview'

import { HoliTheme } from '@holi/ui/styles/theme'

export interface HoliWebViewProps {
  style?: StyleProp<ViewStyle>
  theme: HoliTheme
  webViewProps: WebViewProps // contains source
  navigateToExternalBrowser?: boolean
}
