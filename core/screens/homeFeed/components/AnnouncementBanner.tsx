import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

const AnnouncementBanner: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <View style={styles.banner}>{children}</View>
}

export default AnnouncementBanner

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.brandColorC20,
    borderRadius: 4,
    padding: 16,
    textAlign: 'center',
  },
})
