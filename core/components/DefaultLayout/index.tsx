import React from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'

import Default from '@holi/core/components/DefaultLayout/Default'
import HeaderOffsetScrollView from '@holi/core/components/DefaultLayout/HeaderOffsetScrollView'
import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import { dimensions } from '@holi/ui/styles/globalVars'

/**
 * This is the default screen layout.
 * Scrolling works differently in mobile and web:
 * Mobile is done via `ScrollView` within this file.
 * Web scrolling is done here: `components/DefaultLayout.tsx`
 */

const DefaultLayout = React.forwardRef<ScrollView, LayoutProps>(
  ({ headerOverlap, children, backgroundColor, ...defaultLayoutProps }, ref) => {
    const content = (
      <Default
        contentStyle={StyleSheet.flatten(!headerOverlap && styles.headerPadding)}
        backgroundColor={backgroundColor}
        {...defaultLayoutProps}
        ref={ref}
      >
        {children}
      </Default>
    )
    return headerOverlap ? (
      content
    ) : (
      <HeaderOffsetScrollView backgroundColor={backgroundColor}>{content}</HeaderOffsetScrollView>
    )
  }
)

DefaultLayout.displayName = 'DefaultLayout'

export default DefaultLayout

export const styles = StyleSheet.create({
  headerPadding: {
    paddingTop: dimensions.topBarHeight + (Platform.OS === 'ios' ? -8 : 0),
  },
})
