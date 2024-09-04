import * as React from 'react'
import { AccessibilityProps, ColorValue, Platform, Text, TextProps, TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import { fonts } from '@holi/ui/no-name/foundations/fonts'

export type TypographySize = '4xl' | '3xl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
export type TypographyVariant = 'normal' | 'link'
export type TypographyHeadingLevel = '1' | '2' | '3'

export interface TypographyProps {
  size: TypographySize
  variant?: TypographyVariant
  /**
   * For usage inside buttons it is advised to set this to `false`, so selecting the text does not interfere with button taps.
   */
  selectable?: boolean
  testID?: string
  numberOfLines?: number
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  ellipsizeMode?: TextProps['ellipsizeMode']
  headingLevel?: TypographyHeadingLevel
}

const createAccessibilityProps = (
  headingLevel?: TypographyHeadingLevel
): AccessibilityProps & AccessibilityPropsWeb => {
  if (!headingLevel) {
    return { accessible: false }
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

const Typography = ({
  size,
  variant = 'normal',
  selectable = true,
  testID,
  numberOfLines,
  color,
  textAlign,
  ellipsizeMode,
  headingLevel,
  children,
}: React.PropsWithChildren<TypographyProps>) => {
  const bold = variant === 'link' || size === 'lg'
  const link = variant === 'link' ? size : undefined
  const { styles } = useStyles(stylesheet, { size, bold, link })

  const accessibilityProps = createAccessibilityProps(headingLevel)

  return (
    <Text
      {...accessibilityProps}
      selectable={Platform.OS !== 'web' ? selectable : undefined}
      testID={testID}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={styles.typography(selectable, color, textAlign)}
    >
      {children}
    </Text>
  )
}

export default Typography

const stylesheet = createStyleSheet((theme) => ({
  typography: (selectable: boolean, color?: ColorValue, textAlign?: TextStyle['textAlign']) => {
    return {
      fontVariant: ['lining-nums', 'tabular-nums'],
      fontFamily: fonts.regular,
      fontWeight: '400',
      color: color ?? theme.colors.text,
      userSelect: selectable ? 'auto' : 'none',
      textAlign: textAlign,
      ...Platform.select({
        web: {
          // Currently not supported on mobile
          fontFeatureSettings: '"ss12", "ss11", "ss10", "ss07", "ss05", "ss04", "ss08", "ss03", "liga" 0',
        },
      }),
      variants: {
        bold: {
          true: {
            fontFamily: fonts.bold,
            fontWeight: '500',
          },
        },
        size: {
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
        },
        link: {
          '4xl': {},
          '3xl': {},
          xxl: {},
          xl: {},
          lg: {},
          md: {
            letterSpacing: -0.192,
          },
          sm: {
            letterSpacing: -0.03,
          },
          xs: {
            letterSpacing: 0.026,
          },
        },
      },
    }
  },
}))
