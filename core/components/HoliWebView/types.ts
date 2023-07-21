import { StyleProp, ViewStyle } from 'react-native'
import { WebViewProps } from 'react-native-webview'

export interface HoliWebViewProps {
  uri: string
  style?: StyleProp<ViewStyle>
  webViewProps?: WebViewProps
}
