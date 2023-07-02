import { ScrollViewProps, StyleProp, ViewStyle } from 'react-native'

export interface LayoutProps extends ScrollViewProps {
  headerOverlap?: boolean
  hasFooterTabBar?: boolean
  scrollable?: boolean
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  testID?: string
}
