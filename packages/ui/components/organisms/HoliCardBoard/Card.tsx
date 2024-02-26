import React, { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  color?: 'primary' // Will be extended together with design
}

type ColorType = 'primary'

const generateStyles = (type: ColorType) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  // TODO: future colors are constrained and generated here. (Consult with design)
  const colorStyles = StyleSheet.create({ color: { backgroundColor: colors.white100 } })
  return StyleSheet.flatten([styles.card, type && colorStyles.color])
}

export const Card = ({ children, color = 'primary' }: PropsWithChildren<Props>) => {
  return <View style={generateStyles(color)}>{children}</View>
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 24,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.background30,
      padding: 24,
      borderRadius: 16,
    },
  })
