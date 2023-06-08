import React from 'react'
import { ScrollViewProps, StyleSheet, ViewStyle } from 'react-native'

import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { colors } from '@holi/ui/styles/globalVars'

export interface LayoutProps extends ScrollViewProps {
  headerOverlap?: boolean
  hasFooterTabBar?: boolean
  scrollable?: boolean
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  contentStyle?: ViewStyle | ViewStyle[] | Record<string, unknown>
  testID?: string
}

const HeaderOffsetScrollView = ({ children }: React.PropsWithChildren<unknown>) => (
  <SafeArea style={styles.safeArea}>{children}</SafeArea>
)

export default HeaderOffsetScrollView

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background10,
  },
})
