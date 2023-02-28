import React from 'react'
import { Platform, SafeAreaView, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export interface StepperContentWrapperProps {
  append?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const StepperContentWrapper = ({ append, style, children }: React.PropsWithChildren<StepperContentWrapperProps>) => {
  return (
    <SafeAreaView style={[styles.outer, style]}>
      <View style={styles.inner}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
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
    margin: 20,
  },
})

export default StepperContentWrapper
