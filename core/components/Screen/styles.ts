import type { ScreenOuterPadding } from '@holi/core/components/Screen/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'

const HEADER_HEIGHT = 62
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
    screenContentContainer: (noHeader: boolean) => {
      return {
        position: 'relative',
        marginTop: noHeader ? 0 : HEADER_HEIGHT,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }
    },
    padding: (padding?: ScreenOuterPadding) => {
      return {
        paddingTop: padding?.top ? Spacing[padding?.top] : 0,
        paddingBottom: padding?.bottom ? Spacing[padding?.bottom] : 0,
        paddingLeft: padding?.left ? Spacing[padding?.left] : 0,
        paddingRight: padding?.right ? Spacing[padding?.right] : 0,
      }
    },
    stickyBottomOffset: (height: number) => {
      return {
        paddingBottom: height + Spacing['xs'],
      }
    },
    stickyTopOffset: (height: number) => {
      return {
        paddingTop: height,
      }
    },
    withoutScrollHeader: {
      paddingTop: 55,
    },
    stickyTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    stickyTopWeb: (stickyTopOffset: number) => {
      return {
        width: '100%',
        maxWidth: dimensions.maxScreenWidth,
        top: stickyTopOffset + 5, // + extra offset
        zIndex: 10,
      }
    },
    stickyBottomWeb: (stickyBottomOffset: number) => {
      return {
        width: '100%',
        maxWidth: dimensions.maxScreenWidth,
        bottom: stickyBottomOffset + 10,
        left: 0,
        right: 0,
        marginHorizontal: 'auto',
        zIndex: 10,
      }
    },
    stickyBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    relative: {
      position: 'relative',
    },
    flexEnd: {
      justifyContent: 'flex-end',
    },
    flex1: {
      flex: 1,
    },
    inner: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
    innerWeb: {
      maxWidth: dimensions.maxScreenWidth,
      marginHorizontal: 'auto',
      width: '100%',
    },
  }
})
