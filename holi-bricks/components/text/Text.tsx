import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import * as React from 'react'
import {
  AccessibilityProps,
  ColorValue,
  Platform, // eslint-disable-next-line no-restricted-imports
  Text as RNText, // eslint-disable-next-line no-restricted-imports
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native'

// Change import in HOLI-10369
export type TextSize = '4xl' | '3xl' | 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
export type TextHeadingLevel = '1' | '2' | '3'
export type TextVariant =
  /** Primary, Headlines, Body */
  | 'primary'
  /** Body, Captions, Subtexts */
  | 'secondary'
  /** Unselected text, Bottom Navigation */
  | 'tertiary'
  /** Disabled */
  | 'quaternary'
  /** Errors */
  | 'error'

export interface TextProps {
  size: TextSize
  /**
   * For usage inside buttons it is advised to set this to `false`, so selecting the text does not interfere with button taps.
   */
  selectable?: boolean
  numberOfLines?: number
  /** Specifies theme respecting text color, takes precedence over `color`. */
  variant?: TextVariant
  /** Use is discouraged in favor of `variant`. Requires manual theme handling. */
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  ellipsizeMode?: RNTextProps['ellipsizeMode']
  headingLevel?: TextHeadingLevel
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
  variant,
  color,
  textAlign,
  ellipsizeMode,
  headingLevel,
  children,
}: React.PropsWithChildren<TextProps>) => {
  const { styles } = useStyles(stylesheet, { size, variant })

  const accessibilityProps = createAccessibilityProps(headingLevel)

  return (
    <RNText
      {...accessibilityProps}
      selectable={Platform.OS !== 'web' ? selectable : undefined}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      // as TextStyle is required because ts
      // is throwing error cause of this line fontVariant: ['tabular-nums', 'lining-nums'],
      // this might be related to unistyle typings, needs more investigation
      style={styles.text(selectable, color, textAlign) as unknown as TextStyle}
    >
      {children}
    </RNText>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  text: (selectable: boolean, color?: ColorValue, textAlign?: TextStyle['textAlign']) => {
    return {
      fontVariant: ['lining-nums', 'tabular-nums'],
      fontFamily: fontFamilies.regular,
      fontWeight: '400',
      color: color ?? theme.components.text.primary,
      userSelect: selectable ? 'auto' : 'none',
      textAlign: textAlign,
      ...Platform.select({
        web: {
          // Currently not supported on mobile
          fontFeatureSettings: '"ss12", "ss11", "ss10", "ss07", "ss05", "ss04", "ss08", "ss03", "liga" 0',
        },
      }),
      variants: {
        variant: {
          primary: {
            color: theme.components.text.primary,
          },
          secondary: {
            color: theme.components.text.secondary,
          },
          tertiary: {
            color: theme.components.text.tertiary,
          },
          quaternary: {
            color: theme.components.text.quaternary,
          },
          error: {
            color: theme.components.text.error,
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
            letterSpacing: 0.104,
          },
        },
      },
    }
  },
}))
