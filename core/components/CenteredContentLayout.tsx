import React from 'react'
import { Platform, SafeAreaView, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export interface CenteredContentLayoutProps {
  // `append` is ReactNode that we can position (absolute/fixed) over main content in `children`
  append?: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}

const CenteredContentLayout = ({
  append,
  children,
  style,
  contentContainerStyle,
}: React.PropsWithChildren<CenteredContentLayoutProps>) => {
  return (
    <SafeAreaView style={[styles.outer, style]}>
      <View style={styles.inner}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}>
          {children}
        </ScrollView>
      </View>

      {append}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  outer: {
    ...Platform.select({
      web: { minHeight: '100%' },
      native: { flex: 1 },
    }),
    backgroundColor: colors.background20,
    justifyContent: 'center',
  },
  inner: {
    justifyContent: 'center',
    ...Platform.select({
      web: { maxHeight: '100%' },
    }),
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollViewContent: {
    alignItems: 'center',
    margin: 24,
  },
})

export default CenteredContentLayout
