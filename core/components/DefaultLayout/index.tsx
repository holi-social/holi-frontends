import React from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'

import Default, { LayoutProps } from '@holi/core/components/DefaultLayout/Default'
import HeaderOffsetScrollView from '@holi/core/components/DefaultLayout/HeaderOffsetScrollView'
import { vars } from '@holi/ui/styles/globalVars'

export type { LayoutProps } from '@holi/core/components/DefaultLayout/Default'

/**
 * This is the default screen layout.
 * Scrolling works differently in mobile and web:
 * Mobile is done via `ScrollView` within this file.
 * Web scrolling is done here: `core/DefaultLayout.tsx`
 */

const DefaultLayout = React.forwardRef<ScrollView, LayoutProps>(
  ({ headerOverlap, children, ...defaultLayoutProps }, ref) => {
    const content = (
      <Default
        contentStyle={StyleSheet.flatten(!headerOverlap && defaultLayoutProps.onScroll && styles.headerPadding)}
        {...defaultLayoutProps}
        ref={ref}
      >
        {children}
      </Default>
    )
    return headerOverlap ? content : <HeaderOffsetScrollView>{content}</HeaderOffsetScrollView>
  }
)

DefaultLayout.displayName = 'DefaultLayout'

export default DefaultLayout

export const styles = StyleSheet.create({
  headerPadding: {
    paddingTop: vars.topBarHeight + (Platform.OS === 'ios' ? -8 : 0),
  },
})
