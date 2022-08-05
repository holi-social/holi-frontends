import { StyleSheet, useWindowDimensions } from 'react-native'

import { colors, vars } from '@holi/ui/styles/globalVars'

const staticStyles = StyleSheet.create({
  textGrey: {
    color: colors.grey,
  },
})

const useStyleMixins = () => {
  const { width: screenWidth } = useWindowDimensions()

  const dynamicStyles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: vars.maxScreenWidth,
      paddingHorizontal: screenWidth > parseInt(vars.breakpointXl, 10) ? 0 : 20,
    },
  })

  return { staticStyles, dynamicStyles }
}

export { useStyleMixins }
