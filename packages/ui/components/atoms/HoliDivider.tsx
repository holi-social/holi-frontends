import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

const HoliDivider = () => {
  return <View style={styles.divider} />
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.background30,
  },
})

export default HoliDivider
