import { useEffect } from 'react'
import { Pressable, StyleSheet, ViewStyle } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated'
import tinycolor from 'tinycolor2'
import { DrawerContent } from '@holi/core/spaces/navigation/drawer'
import theme from '@holi/styles/theme'

type DrawerProps = {
  open: boolean
  onClose: () => void
  children?: React.ReactChildren
  Content?: typeof DrawerContent
}

const WIDTH = 300

export const Drawer: React.VoidFunctionComponent<DrawerProps> = ({ open, onClose, Content = DrawerContent }) => {
  const offset = useSharedValue(0)
  const visible = useSharedValue(0)

  const animatedDrawerStyles = useAnimatedStyle(() => {
    return { transform: [{ translateX: offset.value }] }
  })

  const animatedModalStyles = useAnimatedStyle(() => ({
    opacity: visible.value / 100,
  }))

  useEffect(() => {
    // FIXME hides after initial render
    if (open) {
      offset.value = withTiming(0)
      visible.value = withSpring(100)
    } else {
      offset.value = withTiming(-WIDTH - 50)
      visible.value = withSpring(0)
    }
  }, [offset, visible, open])

  // prettier-ignore
  return (
    <>
      <Animated.View
        // @ts-ignore
        style={[styles.drawer, animatedDrawerStyles]}
      >
        <Content closeDrawer={onClose} />
      </Animated.View>

      {open && (
        <Animated.View
          // @ts-ignore
          style={[styles.modal, animatedModalStyles]}
        >
          <Pressable onPress={onClose} style={{ flex: 1 }} />
        </Animated.View>
      )}
    </>
  )
}

const styles = StyleSheet.create<{
  modal: ViewStyle
  drawer: ViewStyle
}>({
  modal: {
    zIndex: 887,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tinycolor(theme.colors.backgroundBlack).setAlpha(0.2).toString(),
  },
  drawer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: theme.colors.background,
    zIndex: 888,
    height: '100%',
    top: 0,
    overflow: 'hidden',
    width: WIDTH,
    shadowColor: theme.colors.backgroundBlack,
    shadowOffset: {
      width: 8,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    transform: [{ translateX: -WIDTH - 50 }],
  },
})
