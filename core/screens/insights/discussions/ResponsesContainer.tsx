import React, { ReactNode, useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const ResponsesContainer = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return <View style={styles.container}>{children}</View>
}

const getStyles = ({ colors }: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Spacing['3xs'],
      paddingVertical: Spacing.xxs,
      backgroundColor: colors.background20,
      borderColor: colors.gray100,
      borderWidth: 1,
      borderRadius: 4,
    },
  })

export default ResponsesContainer
