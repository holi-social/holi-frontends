import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface HoliDividerProps {
  autoWidth?: boolean
}

const HoliDivider = ({ autoWidth }: HoliDividerProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme, autoWidth), [theme, autoWidth])

  return <View style={styles.divider} />
}

const getStyles = (theme: HoliTheme, autoWidth?: boolean) =>
  StyleSheet.create({
    divider: {
      flex: autoWidth ? 1 : undefined,
      width: autoWidth ? 'auto' : '100%',
      height: 1,
      backgroundColor: theme.colors.gray100,
    },
  })

export { HoliDivider }
