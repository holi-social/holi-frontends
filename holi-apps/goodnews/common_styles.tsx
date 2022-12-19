import { Platform, StyleSheet } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export const commonStyles = StyleSheet.create({
  headerTextShadow: Platform.select({
    native: {
      shadowColor: colors.shadowColorBlack,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
    default: {},
  }),
})
