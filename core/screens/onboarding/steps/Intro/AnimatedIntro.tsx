import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

import { SMALL_DEVICE_HEIGHT } from '@holi/core/constants/constants'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { Text } from 'holi-bricks/components/text'

const peopleImage = {
  source: require('@holi/ui/assets/img/onboarding/welcome-image/welcome-image.png'),
  width: 260,
  height: 366,
}
const calendarIcon = {
  source: require('@holi/ui/assets/img/onboarding/calendar-icon/calendar-icon.png'),
  width: 36,
  height: 36,
}
const sparkleIcon = {
  source: require('@holi/ui/assets/img/onboarding/sparkle-icon/sparkle-icon.png'),
  width: 72,
  height: 72,
}
const worldIcon = { source: require('@holi/ui/assets/img/onboarding/world-icon/world-icon.png'), width: 72, height: 72 }
const initialAnimationDelay = 100

const AnimatedIntro = () => {
  const { t } = useTranslation()
  const containerOpacity = useSharedValue(0)
  const containerPosition = useSharedValue(70)
  const containerScale = useSharedValue(1.2)
  const iconsOpacity = useSharedValue(0)
  const iconsRotation = useSharedValue(-90)
  const iconsScale = useSharedValue(0)
  const textPosition = useSharedValue(-50)
  const textScale = useSharedValue(1.1)
  const textOpacity = useSharedValue(0)
  const { height: screenHeight } = useClientWindowDimensions()

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
      transform: [{ translateY: containerPosition.value }, { scale: containerScale.value }],
    }
  })
  const iconsStyle = useAnimatedStyle(() => {
    return {
      opacity: iconsOpacity.value,
      transform: [{ rotate: `${iconsRotation.value}deg` }, { scale: iconsScale.value }],
    }
  })

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textPosition.value }, { scale: textScale.value }],
    }
  })

  useEffect(() => {
    containerOpacity.value = withDelay(
      initialAnimationDelay,
      withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
    )

    const containerPositionDelayOffset = 10
    containerPosition.value = withDelay(
      initialAnimationDelay + containerPositionDelayOffset,
      withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
    )

    const containerScaleDelayOffset = 50
    containerScale.value = withDelay(
      initialAnimationDelay * 3 + containerScaleDelayOffset,
      withTiming(1, { duration: 200, easing: Easing.in(Easing.ease) })
    )

    iconsOpacity.value = withDelay(
      initialAnimationDelay * 6,
      withTiming(1, { duration: 200, easing: Easing.in(Easing.ease) })
    )
    iconsRotation.value = withDelay(
      initialAnimationDelay * 6,
      withTiming(0, { duration: 260, easing: Easing.out(Easing.ease) })
    )
    iconsScale.value = withDelay(
      initialAnimationDelay * 6,
      withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
    )

    textOpacity.value = withDelay(initialAnimationDelay * 6.5, withTiming(1, { duration: 200 }))
    textPosition.value = withDelay(
      initialAnimationDelay * 6.5,
      withTiming(0, { duration: 260, easing: Easing.out(Easing.ease) })
    )

    textScale.value = withDelay(
      initialAnimationDelay * 7 + 400,
      withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
    )
  })

  return (
    <Animated.View style={[styles.container, { gap: screenHeight < SMALL_DEVICE_HEIGHT ? Spacing.xxs : Spacing.xxl }]}>
      <Animated.View style={[styles.imagesContainer, containerStyle]}>
        <HoliLocalImage
          label={t('onboarding.welcome.peopleImage')}
          imageSource={peopleImage.source}
          width={peopleImage.width}
          height={peopleImage.height}
          resizeMode={'contain'}
        />
        <Animated.View style={[styles.calendar, iconsStyle]}>
          <HoliLocalImage
            label={t('onboarding.welcome.calendarIcon')}
            imageSource={calendarIcon.source}
            width={calendarIcon.width}
            height={calendarIcon.height}
            resizeMode={'contain'}
          />
        </Animated.View>
        <Animated.View style={[styles.world, iconsStyle]}>
          <HoliLocalImage
            label={t('onboarding.welcome.worldIcon')}
            imageSource={worldIcon.source}
            width={worldIcon.width}
            height={worldIcon.height}
            resizeMode={'contain'}
          />
        </Animated.View>
        <Animated.View style={[styles.sparkle, iconsStyle]}>
          <HoliLocalImage
            label={t('onboarding.welcome.sparkleIcon')}
            imageSource={sparkleIcon.source}
            width={sparkleIcon.width}
            height={sparkleIcon.height}
            resizeMode={'contain'}
          />
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text size="3xl" textAlign="center">
          {t('onboarding.welcome.title')}
        </Text>
        <Text size="3xl" textAlign="center">
          {t('onboarding.welcome.text')}
        </Text>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    zIndex: 0,
  },
  imagesContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 30,
    left: 82,
  },
  world: {
    position: 'absolute',
    bottom: 88,
    left: -28,
  },
  sparkle: {
    position: 'absolute',
    bottom: 30,
    right: -30,
  },
})

export default AnimatedIntro
