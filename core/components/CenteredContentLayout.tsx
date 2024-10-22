import React from 'react'
import {
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

export interface CenteredContentLayoutProps {
  // `append` is ReactNode that we can position (absolute/fixed) over main content in `children`
  append?: React.ReactNode
  contentContainerStyle?: StyleProp<ViewStyle>
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps']
  testID?: string
}

const CenteredContentLayout = React.forwardRef<ScrollView, React.PropsWithChildren<CenteredContentLayoutProps>>(
  ({ append, children, contentContainerStyle, keyboardShouldPersistTaps = 'never', testID }, ref) => {
    return (
      <SafeAreaView style={[styles.outer]}>
        <View style={styles.inner} testID={testID}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={contentContainerStyle}
            ref={ref}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          >
            <HoliContainer>
              <HoliBox padding={[24, 0]}>
                <View style={styles.childrenWrapper}>{children}</View>
              </HoliBox>
            </HoliContainer>
          </ScrollView>
        </View>

        {append}
      </SafeAreaView>
    )
  }
)

CenteredContentLayout.displayName = 'CenteredContentLayout'

// Be careful with style changes, they are very fragile to keep correct for all platforms
const styles = StyleSheet.create({
  outer: {
    ...Platform.select({
      web: { minHeight: '100%' },
    }),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inner: {
    justifyContent: 'center',
    maxHeight: '100%',
    maxWidth: '100%',
  },
  scrollView: {
    overflow: 'visible',
  },
  childrenWrapper: {
    alignItems: 'center',
  },
})

export default CenteredContentLayout
