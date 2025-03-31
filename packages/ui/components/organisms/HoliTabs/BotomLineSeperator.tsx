import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const BottomLineSeperator = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return <View style={styles.botomLineSeperator} />
}

export default BottomLineSeperator

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    botomLineSeperator: {
      width: '100%',
      borderBottomColor: theme.colors.background30,
      borderBottomWidth: 2,
      position: 'absolute',
      bottom: 0,
    },
  })
