import { Platform, StyleSheet } from 'react-native'

export const commonStyles = StyleSheet.create({
  headerTextShadow: Platform.select({
    native: {
      shadowColor: 'rgba(0,0,0,1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
    default: {},
  }),
})
