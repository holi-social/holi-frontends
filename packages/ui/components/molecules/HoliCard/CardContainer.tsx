import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { BorderColor, BorderRadius } from './utils'

export interface CardContainerProps {
  borderColor?: BorderColor
  borderRadius?: BorderRadius
  hasBorder?: boolean
  extraBottomPadding?: boolean
  testID?: string
}

export const CardContainer = ({
  hasBorder,
  borderColor = 'gray200',
  borderRadius = 8,
  extraBottomPadding = true,
  children,
  testID,
}: PropsWithChildren<CardContainerProps>) => {
  const { theme } = useTheme()
  const styles = React.useMemo(
    () => getStyles(theme, borderColor, borderRadius, extraBottomPadding),
    [borderColor, borderRadius, extraBottomPadding, theme]
  )

  return (
    <View testID={testID} style={StyleSheet.flatten([styles.container, hasBorder && styles.withBorder])}>
      {children}
    </View>
  )
}

const getStyles = (
  theme: HoliTheme,
  borderColor: BorderColor,
  borderRadius: BorderRadius,
  extraBottomPadding: boolean
) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      flex: 1,
      height: '100%',
      padding: 8,
      paddingBottom: extraBottomPadding ? 16 : 8,
      borderRadius: 16,
      backgroundColor: theme.colors.background10,
    },
    withBorder: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors[borderColor],
      borderRadius: borderRadius,
    },
  })
