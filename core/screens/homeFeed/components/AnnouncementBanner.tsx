import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const AnnouncementBanner: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)

  return <View style={styles.banner}>{children}</View>
}

export default AnnouncementBanner

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    banner: {
      backgroundColor: theme.colors.brandColorC20,
      borderRadius: 4,
      padding: 16,
      textAlign: 'center',
    },
  })
