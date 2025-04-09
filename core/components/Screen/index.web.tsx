import React from 'react'
import { View } from 'react-native'
import { useStyles } from 'holi-bricks/hooks'
import { stylesheet } from '@holi/core/components/Screen/styles'
import type { ScreenProps, ScrollScreenProps } from '@holi/core/components/Screen/types'
import { useScreenComponentInternal } from './useScreenComponentInternal'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

export const Screen = (props: ScreenProps) => {
  const {
    keyboardAvoidingViewProps,
    backgroundColor = 'main',
    StickyBottomComponent,
    StickyTopComponent,
    padding,
    contentContainerPadding,
    headerOptions,
    testID,
    children,
    contentContainerStyle,
    scrollViewProps,
    style,
  } = props as ScrollScreenProps

  const { styles, theme } = useStyles(stylesheet)
  const { stickyBottomLayout, stickyBottomOffset, stickyTopLayout, stickyTopOffset, headerHeight } =
    useScreenComponentInternal({ headerOptions })

  return (
    <View
      testID={testID}
      style={[styles.padding(padding), styles.container, { backgroundColor: theme.colors.bg[backgroundColor] }]}
    >
      <HoliContainer flex={1}>
        <View
          style={[
            styles.flex1,
            keyboardAvoidingViewProps?.style,
            styles.webContainer,
            StickyTopComponent ? styles.stickyTopOffset(stickyTopOffset) : null,
            StickyBottomComponent ? styles.stickyBottomOffset(stickyBottomOffset) : null,
          ]}
        >
          {StickyTopComponent && (
            <View style={[styles.stickyTopWeb(headerHeight), { position: 'fixed' }]} onLayout={stickyTopLayout}>
              <HoliContainer>{StickyTopComponent}</HoliContainer>
            </View>
          )}

          <ScrollViewRefreshable
            {...scrollViewProps}
            style={[scrollViewProps?.style, style, styles.contentContainerPadding(0, 0, contentContainerPadding)]}
            contentContainerStyle={[scrollViewProps?.contentContainerStyle, contentContainerStyle]}
          >
            {children}
          </ScrollViewRefreshable>

          {StickyBottomComponent && (
            <View
              style={[
                styles.stickyBottomWeb(headerOptions?.navigationCustomOptions?.footerShown === false),
                { position: 'fixed' },
              ]}
              onLayout={stickyBottomLayout}
            >
              <HoliContainer>{StickyBottomComponent}</HoliContainer>
            </View>
          )}
        </View>
      </HoliContainer>
    </View>
  )
}
