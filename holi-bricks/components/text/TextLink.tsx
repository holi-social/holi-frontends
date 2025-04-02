import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { fontFamilies } from 'holi-bricks/components/text/fontFamilies'
import type { TextColor } from 'holi-bricks/components/text/Text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import type React from 'react'
import {
  type ColorValue,
  type GestureResponderEvent,
  Platform,
  // eslint-disable-next-line no-restricted-imports
  Text,
  // eslint-disable-next-line no-restricted-imports
  type TextProps,
  type TextStyle,
} from 'react-native'

export type TextLinkSize = 'md' | 'sm' | 'xs'

export interface TextLinkProps extends AccessibilityProps, React.PropsWithChildren {
  size: TextLinkSize
  numberOfLines?: number
  /** Managed Theme color. */
  color?: TextColor
  /** Use this if you need to provide an explicit color and/or manually manage the color for each theme  */
  colorOveride?: ColorValue
  textAlign?: TextStyle['textAlign']
  ellipsizeMode?: TextProps['ellipsizeMode']
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => unknown | Promise<unknown>
}

export const TextLink = ({
  size,
  numberOfLines,
  color = 'main',
  colorOveride,
  textAlign,
  ellipsizeMode,
  children,
  onPress,
  role = 'link',
  ...rest
}: TextLinkProps) => {
  const { styles } = useStyles(stylesheet, { size })

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
      style={styles.text(color, colorOveride, textAlign) as unknown as TextStyle}
      onPress={onPress}
    >
      {children}
    </Text>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  text: (color: TextColor, colorOveride?: ColorValue, textAlign?: TextStyle['textAlign']) => {
    return {
      fontVariant: ['lining-nums', 'tabular-nums'],
      fontFamily: fontFamilies.bold,
      fontWeight: '500',
      color: colorOveride ?? theme.colors.fill[color],
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
