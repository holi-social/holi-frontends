import type { CSSProperties } from 'react'
import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import type { KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller'

export type RefreshableScrollHeaderLayoutProps<T extends LayoutProps> = T & {
  headerOverlap?: boolean
  webWrapperStyle?: CSSProperties
}

export type RefreshableScrollViewProps<T extends LayoutProps> = Omit<
  RefreshableScrollHeaderLayoutProps<T>,
  'headerOverlap' | 'webWrapperStyle'
> & {
  headerOverlap?: boolean
}

// add here more props from ScrollViewProps if needed
export interface ScrollHeaderLayoutProps
  extends Pick<
    KeyboardAwareScrollViewProps,
    | 'style'
    | 'contentContainerStyle'
    | 'bounces'
    | 'keyboardShouldPersistTaps'
    | 'keyboardDismissMode'
    | 'onScroll'
    | 'onLayout'
    | 'onContentSizeChange'
    | 'bottomOffset'
  > {
  /**
   * @description use 'headerRelation' to adjust the ScrollView offset top in relation to the header
   * @default 'offset' - offset the content by the header height
   * @example 'overlap' - header will overlap the content, no offset for content but refresh control will have offset
   * @example 'none' - no offset for content and refresh control
   */
  headerRelation?: 'overlap' | 'offset' | 'none'
  backgroundColor?: string
  testID?: string
  noRefresh?: boolean
  refreshBackgroundColor?: string
}
