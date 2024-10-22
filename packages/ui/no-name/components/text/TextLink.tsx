import * as React from 'react'
import { ColorValue, Platform, Text, TextProps, TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { fontFamilies } from '@holi/ui/no-name/components/text/fontFamilies'

export type TextLinkSize = 'md' | 'sm' | 'xs'

export interface TextLinkProps {
  size: TextLinkSize
  numberOfLines?: number
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  ellipsizeMode?: TextProps['ellipsizeMode']
  onPress?: TextProps['onPress']
}

export const TextLink = ({
  size,
  numberOfLines,
  color,
  textAlign,
  ellipsizeMode,
  children,
  onPress,
}: React.PropsWithChildren<TextLinkProps>) => {
  const { styles } = useStyles(stylesheet, { size })

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
      color: color ?? theme.colors.text,
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
