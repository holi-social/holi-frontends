import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import * as React from 'react'
// eslint-disable-next-line no-restricted-imports
import { ColorValue, Platform, Text, TextProps, TextStyle } from 'react-native'

export type TextLinkSize = 'md' | 'sm' | 'xs'
export type TextLinkVariant =
  /** Primary, Headlines, Body */
  | 'primary'
  /** Body, Captions, Subtexts */
  | 'secondary'
  /** Unselected text, Bottom Navigation */
  | 'tertiary'
  /** Disabled */
  | 'quaternary'
  /** Mentions, Locations, Special cases */
  | 'special'

export interface TextLinkProps {
  size: TextLinkSize
  numberOfLines?: number
  variant?: TextLinkVariant
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  ellipsizeMode?: TextProps['ellipsizeMode']
  onPress?: TextProps['onPress']
}

export const TextLink = ({
  size,
  numberOfLines,
  variant = 'primary',
  color,
  textAlign,
  ellipsizeMode,
  children,
  onPress,
}: React.PropsWithChildren<TextLinkProps>) => {
  const { styles } = useStyles(stylesheet, { size, variant })

  return (
    <Text
      selectable={Platform.OS !== 'web' ? false : undefined}
      role="link"
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={styles.text(color, textAlign)}
      onPress={onPress}
    >
      {children}
    </Text>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  text: (color?: ColorValue, textAlign?: TextStyle['textAlign']) => {
    return {
      fontVariant: ['lining-nums', 'tabular-nums'],
      fontFamily: fontFamilies.bold,
      fontWeight: '500',
      userSelect: 'auto',
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
            color: color ?? theme.components.text.primary,
          },
          secondary: {
            color: color ?? theme.components.text.secondary,
          },
          tertiary: {
            color: color ?? theme.components.text.tertiary,
          },
          quaternary: {
            color: color ?? theme.components.text.quaternary,
          },
          special: {
            color: color ?? theme.components.text.specialLink,
          },
        },
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
