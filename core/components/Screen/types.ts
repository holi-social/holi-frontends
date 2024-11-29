import type { ScrollEnabledToggleThreshold } from '@holi/core/components/Screen/useAutoPreset'
import type { SpacingSize } from 'holi-bricks/tokens'
import type { ReactNode } from 'react'
import type { ScrollViewProps, KeyboardAvoidingViewProps, ViewStyle, StyleProp, StatusBarProps } from 'react-native'
import type { Edges } from 'react-native-safe-area-context'

export type ScreenOuterPadding = {
  top?: SpacingSize
  bottom?: SpacingSize
  left?: SpacingSize
  right?: SpacingSize
}

export interface BaseScreenProps {
  contentPadding?: ScreenOuterPadding
  noHeader?: boolean
  /**
   * Background of the screen
   */
  backgroundColor?: string
  /**
   * The distance between keyboard and focused `TextInput` when keyboard is shown. Default is `0`.
   */
  keyboardBottomOffset?: number
  /**
   * Control status bar options. Note that status bar theme
   * is managed automatically
   */
  StatusBarProps?: StatusBarProps
  StickyBottomComponent?: ReactNode
  headerSpacing?: 'default' | 'none' | SpacingSize
  /**
   * Safe areas object. Avoid using it if you are using preset scroll and enableScrollHeader is true
   * because the scroll header already manage it by default. This behavior must be changed in the future.
   */
  safeAreaEdges?: Edges
  /**
   * Distance between the top of the user screen and the React Native view. This
   * may be non-zero in some cases. Defaults to 0.
   */
  keyboardOffset?: number
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  /**
   * Padding object { top, bottom, left, right } needed to add
   * padding to the screen outer container. It uses padding.
   */
  padding?: ScreenOuterPadding
  children: ReactNode | ReactNode[]
  testID?: string
}

export interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed'
  StickyTopComponent?: ReactNode
}

export interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll'
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never'
  ScrollViewProps?: ScrollViewProps
  enableScrollHeader?: boolean
}

export interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto'
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollEnabledToggleThreshold?: ScrollEnabledToggleThreshold
}

export type ScreenProps = ScrollScreenProps | FixedScreenProps | AutoScreenProps

export type ScreenPreset = 'fixed' | 'scroll' | 'auto'
