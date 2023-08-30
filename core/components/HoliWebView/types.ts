import { StyleProp, ViewStyle } from 'react-native'
import { WebViewProps } from 'react-native-webview'

export interface HoliWebViewProps {
  style?: StyleProp<ViewStyle>
  webViewProps: WebViewProps // contains source
  navigateToExternalBrowser?: boolean
}
