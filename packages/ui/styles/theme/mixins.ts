import { Platform, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native'

import { vars } from '@holi/ui/styles/globalVars'

const staticStyles = StyleSheet.create({
  inlineButtonFixDefault: {
    transform: [{ translateY: Platform.select({ ios: 3, android: 4, default: 0 }) }],
  },
  inlineButtonFixSmall: {
    transform: [{ translateY: Platform.select({ ios: 2, android: 4, default: 0 }) }],
  },
  inlineButtonFixMedium: {
    transform: [{ translateY: Platform.select({ ios: 3, android: 5, default: 0 }) }],
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
    twoColumnGridWeb: {
      ...Platform.select({
        web: {
          display: 'grid',
          gridTemplateColumns: screenWidth > +vars.breakpointM ? '1fr 1fr' : '1fr',
          gap: 24,
        },
      }),
    } as ViewStyle,
    moreButton: {
      marginTop: 50,
      maxWidth: 800,
      alignSelf: 'center',
    },
  })

  return { ...staticStyles, ...dynamicStyles }
}

export { useStyleMixins }
