import * as React from 'react'
import { useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation, {
  HoliConfirmationProps,
  useConfirmationState,
} from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface SwipeableProps {
  onSwipeLeft: () => void
  swipeLeftContent: React.ReactNode | string
  swipeLeftConfirmation?: Omit<HoliConfirmationProps, 'show'>
}

/**
 * This component allows to make a component swipeable to reveal an action button.
 * When confirmationProps are provided, the confirmation is shown before the action is executed.
 * Otherwise the action is executed immediately.
 */
const HoliSwipeable = ({
  onSwipeLeft,
  swipeLeftContent,
  swipeLeftConfirmation,
  children,
}: React.PropsWithChildren<SwipeableProps>) => {
  const swipableRef = useRef<Swipeable | null>(null)
  const { theme } = useTheme()
  const styles = React.useMemo(() => getStyles(theme), [theme])

  const { setShow: showConfirmation, props: confirmationProps } = useConfirmationState({
    onPrimary: () => {
      onSwipeLeft()
      swipableRef.current?.close()
    },
    onDismiss: () => {
      swipableRef.current?.close()
    },
  })

  const swipeLeft = () => {
    if (swipeLeftConfirmation) {
      showConfirmation(true)
    } else {
      onSwipeLeft()
      swipableRef.current?.close()
    }
  }
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragAnimatedValue: Animated.AnimatedInterpolation<string | number>
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-66, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })
    return (
      <Animated.View style={[styles.wrapper, { opacity }]}>
        <HoliButton label="" transparent onPress={swipeLeft} style={styles.swipeLeftButton}>
          {swipeLeftContent}
        </HoliButton>
      </Animated.View>
    )
  }

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipableRef}>
      {children}
      {!!swipeLeftConfirmation && <HoliConfirmation {...{ ...swipeLeftConfirmation, ...confirmationProps }} />}
    </Swipeable>
  )
}

HoliSwipeable.displayName = 'HoliSwipeableItem'

export default HoliSwipeable

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      width: 66,
    },
    swipeLeftButton: {
      backgroundColor: theme.colors.error300,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex', // for web
      height: '100%',
    },
  })
