import * as React from 'react'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle, View } from 'react-native'

import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { defaultTextOptionsAsProps } from '@holi/ui/components/atoms/HoliSkeleton/defaults'
import { SkeletonTextOptions } from '@holi/ui/components/atoms/HoliSkeleton/types'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export const HoliTextSizes = ['extralarge', 'large', 'default', 'small', 'extrasmall'] as const
export type HoliTextSize = (typeof HoliTextSizes)[number]
export type HoliTextColor = 'black300' | 'error200' | 'gray200' | 'gray300' | 'white100' | 'white200' | 'brandB300'

// TODO: remove the style prop from the interface as it break design and
// introduce bugs.
export interface HoliTextProps extends TextProps {
  align?: TextStyle['textAlign']
  color?: HoliTextColor
  bold?: boolean
  size?: HoliTextSize
  selectable?: boolean
  style?: StyleProp<TextStyle>
  testID?: string
  numberOfLines?: number
  loading?: boolean
  skeletonOptions?: SkeletonTextOptions
}

const HoliText = ({
  children,
  bold,
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
  const styles = getStyles(theme)
  const alignStyles = getAlignStyles(align)

  if (loading) {
    return (
      <View style={props?.style}>
        <HoliSkeleton {...defaultTextOptionsAsProps(skeletonOptions, numberOfLines, styles[size].lineHeight, '60%')} />
      </View>
    )
  }

  return (
    <Text
      accessible={false}
      selectable={selectable}
      testID={testID}
      numberOfLines={numberOfLines}
      {...props}
      style={StyleSheet.flatten([
        styles.base,
        styles[size],
        styles[color],
        !!align && alignStyles.align,
        !!bold && styles.bold,
        props.style,
      ])}
    >
      {children}
    </Text>
  )
}

export default HoliText

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    base: {
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: colors.foreground30,
    },
    extralarge: {
      fontSize: 28,
      lineHeight: 28 * 1.2,
    },
    large: {
      fontSize: 21,
      lineHeight: 21 * 1.2,
    },
    default: {
      fontSize: 16,
      lineHeight: 16 * 1.2,
    },
    small: {
      fontSize: 14,
      lineHeight: 14 * 1.2,
    },
    extrasmall: {
      fontSize: 12,
      lineHeight: 12 * 1.2,
    },
    black300: {
      color: colors.foreground30,
    },
    gray300: {
      color: colors.foreground20,
    },
    gray200: {
      color: colors.foreground10,
    },
    white100: {
      color: colors.white100,
    },
    white200: {
      color: colors.white200,
    },
    error200: {
      color: colors.error20,
    },
    brandB300: {
      color: colors.brandColorB30,
    },
    bold: {
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
    },
  })

function getAlignStyles(alignPosition: TextStyle['textAlign']) {
  return StyleSheet.create({
    align: {
      textAlign: alignPosition,
    },
  })
}
