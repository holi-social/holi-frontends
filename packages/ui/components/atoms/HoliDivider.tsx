import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const HoliDivider = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return <View style={styles.divider} />
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.gray100,
    },
  })

export { HoliDivider }
