import { StyleSheet } from 'react-native-unistyles'
import type * as React from 'react'
import {
  type ColorValue,
  Platform, // eslint-disable-next-line no-restricted-imports
  Text as RNText, // eslint-disable-next-line no-restricted-imports
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native'

import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import type { FillColors } from 'holi-bricks/foundations/colors/themes/types'
import { type LayoutProps, layoutStyle } from 'holi-bricks/foundations'

// Change import in HOLI-10369
export type TextSize = '5xl' | '4xl' | '3xl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
export type TextHeadingLevel = '1' | '2' | '3'

export type TextProps = AccessibilityProps &
  LayoutProps &
  React.PropsWithChildren & {
    size: TextSize
    /**
     * For usage inside buttons it is advised to set this to `false`, so selecting the text does not interfere with button taps.
     */
    selectable?: boolean
    numberOfLines?: number
    /** Managed Theme color. */
    color?: FillColors
    /** Use this if you need to provide an explicit color and/or manually manage the color for each theme  */
    colorOverride?: TextStyle['color']
    textAlign?: TextStyle['textAlign']
    ellipsizeMode?: RNTextProps['ellipsizeMode']
    headingLevel?: TextHeadingLevel
    bold?: boolean
    testID?: string
  }

// Change import in HOLI-10369
const createAccessibilityProps = (headingLevel?: TextHeadingLevel): AccessibilityProps & AccessibilityPropsWeb => {
  if (!headingLevel) {
    return {
      accessible: false,
      role: 'none',
    }
  }
  return Platform.select({
    web: {
      role: 'heading',
      'aria-level': Number(headingLevel),
    },
    default: {
      role: 'heading',
    },
  })
}

export const Text = ({
  size,
  selectable = true,
  numberOfLines,
  color = 'main',
  colorOverride,
  textAlign,
  ellipsizeMode,
  headingLevel,
  bold,
  children,
  testID,
  ...rest
}: TextProps) => {
  styles.useVariants({ size })

  const textAccessibilityProps = createAccessibilityProps(headingLevel)

  return (
    <RNText
      {...textAccessibilityProps}
      {...accessibilityProps(rest)}
      testID={testID}
      selectable={Platform.OS !== 'web' ? selectable : undefined}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      // as TextStyle is required because ts
      // is throwing error cause of this line fontVariant: ['tabular-nums', 'lining-nums'],
      // this might be related to unistyle typings, needs more investigation
      style={[
        styles.text(color, selectable, colorOverride, textAlign, bold) as unknown as TextStyle,
        layoutStyle(rest),
      ]}
    >
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create((theme) => ({
  text: (
    color: TextProps['color'],
    selectable: boolean,
    colorOverride?: ColorValue,
    textAlign?: TextStyle['textAlign'],
    bold?: boolean
  ) => {
    const textColor = color ? theme.colors.fill[color] : theme.colors.fill.default
    return {
      fontVariant: ['lining-nums', 'tabular-nums'],
      fontFamily: fontFamilies.regular,
      fontWeight: '400',
      color: colorOverride ?? textColor,
      userSelect: selectable ? 'auto' : 'none',
      textAlign: textAlign,
      ...Platform.select({
        web: {
          // Currently not supported on mobile
          fontFeatureSettings: '"ss12", "ss11", "ss10", "ss07", "ss05", "ss04", "ss08", "ss03", "liga" 0',
        },
      }),
      ...(bold && { fontWeight: '600' }),
      variants: {
        size: {
          '5xl': {
            fontSize: 120,
            lineHeight: 120 * 1.2,
            letterSpacing: -4.8,
          },
          '4xl': {
            fontSize: 36,
            lineHeight: 36 * 1.2,
            letterSpacing: -1.44,
          },
          '3xl': {
            fontSize: 28,
            lineHeight: 28 * 1.2,
            letterSpacing: -0.896,
          },
          xxl: {
            fontSize: 20,
            lineHeight: 20 * 1.2,
            letterSpacing: 0.2,
          },
          xl: {
            fontSize: 18,
            lineHeight: 18 * 1.2,
            letterSpacing: -0.18,
          },
          lg: {
            fontFamily: fontFamilies.bold,
            fontWeight: '500',
            fontSize: 16,
            lineHeight: 16 * 1.4,
            letterSpacing: -0.256,
          },
          md: {
            fontSize: 16,
            lineHeight: 16 * 1.48,
            letterSpacing: -0.128,
          },
          sm: {
            fontSize: 15,
            lineHeight: 15 * 1.4,
            letterSpacing: -0.12,
          },
          xs: {
            fontSize: 13,
            lineHeight: 13 * 1.2,
            letterSpacing: 0.104,
          },
          xxs: {
            fontSize: 11,
            lineHeight: 11 * 1.2,
            letterSpacing: 0.2,
          },
        },
      },
    }
  },
}))
