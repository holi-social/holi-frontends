import { Platform, StyleSheet } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers/useBreakpointMatcher'
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
  moreButton: {
    marginVertical: 24,
    maxWidth: vars.maxButtonWidth,
    alignSelf: 'center',
  },
})

const useStyleMixins = () => {
  const paddingHorizontal = useBreakpointMatcher([
    [0, 16],
    [+vars.breakpointS, 32],
    [+vars.breakpointL, 64],
  ])

  const dynamicStyles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: +vars.maxScreenWidth,
      paddingHorizontal: paddingHorizontal,
    },
  })

  return { ...staticStyles, ...dynamicStyles }
}

export { useStyleMixins }
