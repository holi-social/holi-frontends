import * as React from 'react'
// eslint-disable-next-line no-restricted-imports
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type TextProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import Animated from 'react-native-reanimated'

import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { defaultTextOptionsAsProps } from '@holi/ui/components/atoms/HoliSkeleton/defaults'
import type { SkeletonTextOptions } from '@holi/ui/components/atoms/HoliSkeleton/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const HoliTextSizes = ['extralarge', 'large', 'default', 'small', 'extrasmall'] as const
export type HoliTextSize = (typeof HoliTextSizes)[number]
export type HoliTextColor = 'black300' | 'error200' | 'gray200' | 'gray300' | 'white100' | 'white200' | 'brandB300'

// TODO: remove the style prop from the interface as it break design and
// introduce bugs.
export interface HoliTextProps extends TextProps {
  align?: TextStyle['textAlign']
  color?: HoliTextColor
  bold?: boolean
  italic?: boolean
  size?: HoliTextSize
  selectable?: boolean
  style?: StyleProp<TextStyle>
  testID?: string
  numberOfLines?: number
  loading?: boolean
  skeletonOptions?: SkeletonTextOptions
}

/**
 * @deprecated Use `Text` from holiBricks instead.
 */
const HoliText = ({
  children,
  bold,
  italic,
  testID,
  align,
  color = 'black300',
  selectable = true,
  size = 'default',
  numberOfLines,
  loading = false,
  skeletonOptions,
  ...props
}: React.PropsWithChildren<HoliTextProps>) => {
  const { theme } = useTheme()
  const styles = React.useMemo(() => getStyles(theme), [theme])
  const alignStyles = getAlignStyles(align)
  const mixins = useStyleMixins()

  if (loading) {
    return (
      <View style={props?.style as StyleProp<ViewStyle>}>
        <HoliSkeleton {...defaultTextOptionsAsProps(skeletonOptions, numberOfLines, styles[size].lineHeight, '60%')} />
      </View>
    )
  }

  return (
    <Animated.Text
      accessible={false}
      selectable={Platform.OS !== 'web' ? selectable : undefined}
      testID={testID}
      numberOfLines={numberOfLines}
      {...props}
      style={StyleSheet.flatten([
        { userSelect: selectable ? 'auto' : 'none' },
        styles.base,
        styles[size],
        mixins[color],
        !!align && alignStyles.align,
        !!bold && styles.bold,
        !!italic && styles.italic,
        props.style,
      ])}
    >
      {children}
    </Animated.Text>
  )
}

export default HoliText

export const fontStylesByHoliTextSize = {
  extralarge: {
    fontSize: 28,
    lineHeight: lineHeight(28),
  },
  large: {
    fontSize: 21,
    lineHeight: lineHeight(21),
  },
  default: {
    fontSize: 16,
    lineHeight: lineHeight(16),
  },
  small: {
    fontSize: 14,
    lineHeight: lineHeight(14),
  },
  extrasmall: {
    fontSize: 12,
    lineHeight: lineHeight(12),
  },
}

function lineHeight(fontSize: number) {
  return fontSize * 1.4
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Regular'),
      color: theme.colors.foreground30,
    },
    bold: {
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
    },
    italic: {
      fontStyle: 'italic',
    },
    ...fontStylesByHoliTextSize,
  })

function getAlignStyles(alignPosition: TextStyle['textAlign']) {
  return StyleSheet.create({
    align: {
      textAlign: alignPosition,
    },
  })
}
