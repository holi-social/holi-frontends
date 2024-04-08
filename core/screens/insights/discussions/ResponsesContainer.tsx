import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

const ResponsesContainer = ({ children }: { children: ReactNode }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
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
