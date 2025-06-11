import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import type { TextProps } from 'holi-bricks/components/text/Text'
import { createStyleSheet } from 'holi-bricks/styles'
import type React from 'react'
import {
  type ColorValue,
  type GestureResponderEvent,
  Platform,
  // eslint-disable-next-line no-restricted-imports
  Text,
  type TextStyle,
} from 'react-native'
import { layoutStyle, type LayoutProps } from 'holi-bricks/foundations'

export type TextLinkSize = 'md' | 'sm' | 'xs'

export type TextLinkProps = AccessibilityProps &
  LayoutProps &
  React.PropsWithChildren & {
    size: TextLinkSize
    numberOfLines?: number
    /** Managed Theme color. */
    color?: TextProps['color']
    /** Use this if you need to provide an explicit color and/or manually manage the color for each theme  */
    colorOverride?: ColorValue
    textAlign?: TextStyle['textAlign']
    ellipsizeMode?: TextProps['ellipsizeMode']
    onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
  }

export const TextLink = ({
  size,
  numberOfLines,
  color = 'main',
  colorOverride,
  textAlign,
  ellipsizeMode,
  children,
  onPress,
  role = 'link',
  ...rest
}: TextLinkProps) => {
  styles.useVariants({ size })

  return (
    <Text
      selectable={Platform.OS !== 'web' ? false : undefined}
      {...accessibilityProps(rest)}
      role={role}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      // as TextStyle is required because ts
      // is throwing error cause of this line fontVariant: ['tabular-nums', 'lining-nums'],
      // this might be related to unistyle typings, needs more investigation
      style={[styles.text(color, colorOverride, textAlign) as unknown as TextStyle, layoutStyle(rest)]}
      onPress={onPress}
    >
      {children}
    </Text>
  )
}

const styles = createStyleSheet((theme) => ({
  text: (color: TextProps['color'], colorOverride?: ColorValue, textAlign?: TextStyle['textAlign']) => {
    const textColor = color ? theme.colors.fill[color] : theme.colors.fill.default
    return {
      fontVariant: ['lining-nums', 'tabular-nums'],
      fontFamily: fontFamilies.bold,
      fontWeight: '500',
      color: colorOverride ?? textColor,
      userSelect: 'auto',
      textAlign: textAlign,
      ...Platform.select({
        web: {
          // Currently not supported on mobile
          fontFeatureSettings: '"ss12", "ss11", "ss10", "ss07", "ss05", "ss04", "ss08", "ss03", "liga" 0',
        },
      }),
      variants: {
        size: {
          md: {
            fontSize: 16,
            lineHeight: 16 * 1.48,
            letterSpacing: -0.192,
          },
          sm: {
            fontSize: 15,
            lineHeight: 15 * 1.4,
            letterSpacing: -0.03,
          },
          xs: {
            fontSize: 13,
            lineHeight: 13 * 1.2,
            letterSpacing: 0.026,
          },
        },
      },
    }
  },
}))
