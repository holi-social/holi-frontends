import { useMemo } from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers/useBreakpointMatcher'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { breakpoints } from 'holi-bricks/foundations'

const getStaticStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      maxWidth: dimensions.maxButtonWidth,
      alignSelf: 'center',
    },
    black300: {
      color: theme.colors.foreground30,
    },
    gray300: {
      color: theme.colors.foreground20,
    },
    gray200: {
      color: theme.colors.foreground10,
    },
    white100: {
      color: theme.colors.white100,
    },
    white200: {
      color: theme.colors.white200,
    },
    error200: {
      color: theme.colors.error20,
    },
    brandB300: {
      color: theme.colors.brandColorB30,
    },
  })

const useStyleMixins = () => {
  const paddingHorizontal = useBreakpointMatcher([
    [0, 16],
    [breakpoints.sm, 32],
    [breakpoints.lg, 64],
  ])

  const { theme } = useTheme()
  const staticStyles = useMemo(() => getStaticStyles(theme), [theme])

  const dynamicStyles = StyleSheet.create({
    /**
     * @deprecated The container mixin should not be used and will be removed.
     * It causes style flashes with SSR. Please use the `<HoliContainer />`
     * instead.
     */
    container: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      paddingHorizontal: paddingHorizontal,
    },
  })

  return { ...staticStyles, ...dynamicStyles }
}

export { useStyleMixins }
