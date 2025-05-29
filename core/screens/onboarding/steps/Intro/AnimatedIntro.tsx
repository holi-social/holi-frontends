import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { Text } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'

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
    <Animated.View>
      <Animated.View style={[styles.imagesContainer, containerStyle]}>
        <Image
          source={require('@holi/ui/assets/img/onboarding/hero.png')}
          width={560}
          height={448}
          alt={t('onboarding.welcome.hero')}
          resizeMode="contain"
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
      <Stack alignItems="center">
        <View style={styles.heroImageAlignment}>
          <Text size="4xl" headingLevel="1" numberOfLines={2}>
            {t('onboarding.welcome.title')}
          </Text>
        </View>
      </Stack>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  imagesContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  heroImageAlignment: {
    width: 380,
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
