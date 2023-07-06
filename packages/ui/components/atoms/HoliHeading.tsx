import * as React from 'react'
import { AccessibilityProps, Platform, StyleSheet, Text, TextProps, View } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { SkeletonTextOptions } from '@holi/ui/components/atoms/HoliSkeleton/types'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type HoliHeadingLevel = '1' | '2' | '3' | '4' // for working code completion in vscode
type HoliHeadingSize = 'super' | 'large' | 'medium' | 'small' | 'xSmall' // for working code completion in vscode

const HoliHeadings: Record<
  HoliHeadingLevel,
  {
    defaultSize: HoliHeadingSize
  }
> = {
  1: {
    defaultSize: 'large',
  },
  2: {
    defaultSize: 'medium',
  },
  3: {
    defaultSize: 'small',
  },
  4: {
    defaultSize: 'xSmall',
  },
}

export const HoliHeadingLevels: HoliHeadingLevel[] = Object.keys(HoliHeadings) as unknown as HoliHeadingLevel[]
export const HoliHeadingSizes: HoliHeadingSize[] = ['super', 'large', 'medium', 'small'] // keep in sync with type HoliHeadingSize

export type HoliHeadingProps = {
  size?: HoliHeadingSize
  level?: HoliHeadingLevel
  selectable?: boolean
  testID?: string
  numberOfLines?: number
  loading?: boolean
  skeletonOptions?: SkeletonTextOptions
}

const HoliHeading = ({
  children,
  level = '2',
  size = HoliHeadings[level].defaultSize,
  selectable = true,
  testID,
  numberOfLines,
  loading = false,
  skeletonOptions = {},
  ...props
}: React.PropsWithChildren<HoliHeadingProps & TextProps>) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  if (loading) {
    const { numberOfLines: skeletonNumOfLines = numberOfLines ?? 1, width: skeletonWidth } = skeletonOptions
    const matchingStyle: { lineHeight: number } = styles[size]
    const skeletonHeight = skeletonNumOfLines * matchingStyle.lineHeight
    const multiline = numberOfLines !== 0

    return (
      <View style={props?.style}>
        {multiline ? (
          <HoliSkeleton height={skeletonHeight} width={skeletonWidth ?? '100%'} borderRadius={4} />
        ) : (
          <HoliSkeleton height={skeletonHeight} width={skeletonWidth ?? '40%'} borderRadius={16} />
        )}
      </View>
    )
  }

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = Platform.select({
    web: {
      accessibilityRole: 'header',
      accessibilityLevel: Number(level),
    },
    default: {
      role: 'heading',
    },
  })

  return (
    <Text
      {...props}
      {...accessibilityProps}
      selectable={selectable}
      style={[styles.default, styles[size as keyof typeof styles], props?.style]}
      testID={testID}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  )
}

export default HoliHeading

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    default: {
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
      color: colors.foreground30,
    },
    super: {
      fontSize: 36,
      lineHeight: 36 * 1.2,
    },
    large: {
      fontSize: 28,
      lineHeight: 28 * 1.2,
    },
    medium: {
      fontSize: 21,
      lineHeight: 21 * 1.2,
    },
    small: {
      fontSize: 16,
      lineHeight: 16 * 1.4,
    },
    xSmall: {
      fontSize: 14,
      lineHeight: 14 * 1.4,
    },
  })
