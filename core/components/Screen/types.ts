import type { ScrollToggleHeightThreshold } from '@holi/core/components/Screen/useAutoPreset'
import type { NavigationCustomOptions } from '@holi/core/navigation/hooks/useScreenOptions/types'
import type { SpacingSize } from 'holi-bricks/foundations'
import type { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import type { ReactNode } from 'react'
import type { KeyboardAvoidingViewProps, ScrollViewProps, StatusBarProps, StyleProp, ViewStyle } from 'react-native'
import type { Edges } from 'react-native-safe-area-context'

export type ScreenPadding = {
  top?: SpacingSize
  bottom?: SpacingSize
  left?: SpacingSize
  right?: SpacingSize
}

export interface BaseScreenProps {
  contentPadding?: ScreenPadding
  headerOptions?: NavigationCustomOptions
  /**
   * Background of the screen
   */
  backgroundColor?: keyof (typeof lightTheme)['colors']['bg']
  /**
   * The distance between keyboard and focused `TextInput` when keyboard is shown. Default is `0`.
   */
  keyboardInputOffset?: number
  /**
   * Control status bar options. Note that status bar theme
   * is managed automatically
   */
  // TODO (SF): remove? or migrate?
  statusBarProps?: StatusBarProps
  StickyBottomComponent?: ReactNode
  StickyTopComponent?: ReactNode
  headerSpacing?: 'default' | 'none' | SpacingSize
  /**
   * Safe areas object.
   */
  safeAreaEdges?: Edges
  /**
   * Distance between the top of the user screen and the React Native view. This
   * may be non-zero in some cases. Defaults to 0.
   */
  keyboardVerticalOffset?: number
  keyboardAvoidingViewProps?: Omit<KeyboardAvoidingViewProps, 'contentContainerStyle'>
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  /**
   * Padding of the external wrapper object { top, bottom, left, right } needed to add
   * padding to the screen outer container. It uses padding.
   */
  padding?: ScreenPadding
  /**
   * Pads the wrapper of the inner content
   */
  contentContainerPadding?: ScreenPadding
  children: ReactNode | ReactNode[]
  testID?: string
  /** Disables padding of HoliContainer (web only) */
  noContainerPaddingWeb?: boolean
}

export interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed'
}

export interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll'
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never'
  scrollViewProps?: ScrollViewProps
  onRefresh?(): void
}

export interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto'
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollToggleHeightThreshold?: ScrollToggleHeightThreshold
}

export type ScreenProps = ScrollScreenProps | FixedScreenProps | AutoScreenProps

export type ScreenPreset = 'fixed' | 'scroll' | 'auto'
