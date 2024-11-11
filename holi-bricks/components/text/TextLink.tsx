import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import * as React from 'react'
// eslint-disable-next-line no-restricted-imports
import { ColorValue, Platform, Role, Text, TextProps, TextStyle } from 'react-native'

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
  /** Specifies theme respecting text color, takes precedence over `color`. */
  variant?: TextLinkVariant
  /** Use is discouraged in favor of `variant`. Requires manual theme handling. */
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  ellipsizeMode?: TextProps['ellipsizeMode']
  onPress?: TextProps['onPress']
  role?: Role
}

export const TextLink = ({
  size,
  numberOfLines,
  variant,
  color,
  textAlign,
  ellipsizeMode,
  children,
  onPress,
  role = 'link',
}: React.PropsWithChildren<TextLinkProps>) => {
  const { styles } = useStyles(stylesheet, { size, variant })

  return (
    <Text
      selectable={Platform.OS !== 'web' ? false : undefined}
      role={role}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      // as TextStyle is required because ts
      // is throwing error cause of this line fontVariant: ['tabular-nums', 'lining-nums'],
      // this might be related to unistyle typings, needs more investigation
      style={styles.text(color, textAlign) as unknown as TextStyle}
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
      color: color ?? theme.components.text.primary,
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
          special: {
            color: theme.components.text.specialLink,
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
