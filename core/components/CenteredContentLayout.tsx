import React from 'react'
import { Platform, SafeAreaView, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'

export interface CenteredContentLayoutProps {
  // `append` is ReactNode that we can position (absolute/fixed) over main content in `children`
  append?: React.ReactNode
  contentContainerStyle?: StyleProp<ViewStyle>
}

const CenteredContentLayout = React.forwardRef<ScrollView, React.PropsWithChildren<CenteredContentLayoutProps>>(
  ({ append, children, contentContainerStyle }, ref) => {
    return (
      <SafeAreaView style={[styles.outer]}>
        <View style={styles.inner}>
          <ScrollView style={styles.scrollView} contentContainerStyle={contentContainerStyle} ref={ref}>
            <HoliBox padding={24}>
              <View style={styles.childrenWapper}>{children}</View>
            </HoliBox>
          </ScrollView>
        </View>

        {append}
      </SafeAreaView>
    )
  }
)

CenteredContentLayout.displayName = 'CenteredContentLayout'

const styles = StyleSheet.create({
  outer: {
    ...Platform.select({
      web: { minHeight: '100%' },
    }),
    justifyContent: 'center',
    flex: 1,
  },
  inner: {
    justifyContent: 'center',
    maxHeight: '100%',
  },
  scrollView: {
    overflow: 'visible',
  },
  childrenWapper: {
    alignItems: 'center',
  },
})

export default CenteredContentLayout
