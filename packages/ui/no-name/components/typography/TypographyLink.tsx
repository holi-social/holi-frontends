import * as React from 'react'
import { ColorValue, Platform, Text, TextProps, TextStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { fontFamilies } from '@holi/ui/no-name/components/typography/fontFamilies'

export type TypographyLinkSize = 'md' | 'sm' | 'xs'

export interface TypographyLinkProps {
  size: TypographyLinkSize
  testID?: string
  numberOfLines?: number
  color?: TextStyle['color']
  textAlign?: TextStyle['textAlign']
  ellipsizeMode?: TextProps['ellipsizeMode']
}

const TypographyLink = ({
  size,
  testID,
  numberOfLines,
  color,
  textAlign,
  ellipsizeMode,
  children,
}: React.PropsWithChildren<TypographyLinkProps>) => {
  const { styles } = useStyles(stylesheet, { size })

  return (
    <Text
      selectable={Platform.OS !== 'web' ? false : undefined}
      testID={testID}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={styles.typography(color, textAlign)}
    >
      {children}
    </Text>
  )
}

export default TypographyLink

const stylesheet = createStyleSheet((theme) => ({
  typography: (color?: ColorValue, textAlign?: TextStyle['textAlign']) => {
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
