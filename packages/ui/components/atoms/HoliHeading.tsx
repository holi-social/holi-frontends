import * as React from 'react'
import { AccessibilityProps, Platform, StyleSheet, Text, TextProps, TextStyle } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { defaultTextOptionsAsProps } from '@holi/ui/components/atoms/HoliSkeleton/defaults'
import { SkeletonTextOptions } from '@holi/ui/components/atoms/HoliSkeleton/types'
import defaultTheme, { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliHeadingLevel = '1' | '2' | '3'
export type HoliHeadingSize = 'xl' | 'l' | 'm' | 's'
export type HoliHeadingWeight = '300' | '400' | '500'

const defaultSizes: { [key in HoliHeadingLevel]: HoliHeadingSize } = {
  1: 'l',
  2: 'm',
  3: 's',
}

export type HoliHeadingProps = {
  size?: HoliHeadingSize
  weight?: HoliHeadingWeight
  level?: HoliHeadingLevel
  italic?: boolean
  align?: TextStyle['textAlign']
  selectable?: boolean
  testID?: string
  numberOfLines?: number
  ellipsizeMode?: TextProps['ellipsizeMode']
  loading?: boolean
  skeletonOptions?: SkeletonTextOptions
}

export const HoliHeading = ({
  children,
  level = '2',
  size = defaultSizes[level],
  weight, // should not have a default value! It uses default value from "styles.base"
  italic = false,
  align,
  selectable = true,
  testID,
  numberOfLines,
  loading = false,
  skeletonOptions,
}: React.PropsWithChildren<HoliHeadingProps>) => {
  const { theme } = useTheme()
  const styles = React.useMemo(() => getStyles(theme), [theme])

  if (loading) {
    return (
      <HoliSkeleton {...defaultTextOptionsAsProps(skeletonOptions, numberOfLines, styles[size].lineHeight, '40%')} />
    )
  }

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = Platform.select({
    web: {
      role: 'heading',
      'aria-level': Number(level),
    },
    default: {
      role: 'heading',
    },
  })

  const italicStyle = italic ? italicStyles.italic : {}
  const alignmentStyle = align ? { textAlign: align } : {}

  return (
    <Text
      {...accessibilityProps}
      selectable={Platform.OS !== 'web' ? selectable : undefined}
      style={StyleSheet.flatten([
        styles.base,
        styles[size],
        italicStyle,
        alignmentStyle,
        weight && { fontWeight: weight },
        { userSelect: selectable ? 'auto' : 'none' },
      ])}
      testID={testID}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
      fontWeight: '500',
      fontFamily: defaultTheme.fontFamily.default('Medium'),
      color: theme.colors.black300,
    },
    xl: {
      fontSize: 36,
      lineHeight: 36 * (Platform.OS === 'ios' ? 1.4 : 1.2),
    },
    l: {
      fontSize: 28,
      lineHeight: 28 * (Platform.OS === 'ios' ? 1.4 : 1.2),
    },
    m: {
      fontSize: 21,
      lineHeight: 21 * (Platform.OS === 'ios' ? 1.4 : 1.2),
    },
    s: {
      fontSize: 16,
      lineHeight: 16 * 1.4,
    },
  })

const italicStyles = StyleSheet.create({
  italic: {
    fontStyle: 'italic',
    fontWeight: '300',
  },
})
