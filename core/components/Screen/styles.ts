import type { ScreenPadding } from '@holi/core/components/Screen/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import { Dimensions } from 'react-native'

export const stylesheet = createStyleSheet(() => {
  return {
    container: {
      flex: 1,
      height: '100%',
      width: '100%',
    },
    webContainer: {
      maxWidth: dimensions.maxScreenWidth,
      marginHorizontal: 'auto',
      width: '100%',
    },
    screenContentContainer: {
      position: 'relative',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
    padding: (padding?: ScreenPadding) => {
      return {
        paddingTop: padding?.top ? Spacing[padding?.top] : 0,
        paddingBottom: padding?.bottom ? Spacing[padding?.bottom] : 0,
        paddingLeft: padding?.left ? Spacing[padding?.left] : 0,
        paddingRight: padding?.right ? Spacing[padding?.right] : 0,
      }
    },
    stickyBottomOffset: (offset: number) => {
      return {
        paddingBottom: offset,
      }
    },
    stickyTopOffset: (offset: number) => {
      return {
        paddingTop: offset,
      }
    },
    stickyTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    stickyTopWeb: (headerHeight: number) => {
      return {
        width: '100%',
        top: headerHeight,
        left: 0,
        right: 0,
        zIndex: 10,
      }
    },
    stickyBottomWeb: {
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      bottom: dimensions.bottomBarHeight,
      left: 0,
      right: 0,
      marginHorizontal: 'auto',
      zIndex: 10,
    },
    stickyBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    fixedScreenContainer: {
      flex: 1,
      maxHeight: Dimensions.get('screen').height - dimensions.bottomBarHeight - dimensions.topBarHeight,
    },
    relative: {
      position: 'relative',
    },
    flex1: {
      flex: 1,
    },
  }
})
