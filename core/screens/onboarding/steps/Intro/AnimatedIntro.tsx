import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

import { Text } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'

const sparkles = {
  source: require('@holi/ui/assets/img/onboarding/sparkles.svg'),
  width: 56,
  height: 56,
}
const highFive = {
  source: require('@holi/ui/assets/img/onboarding/high-five.svg'),
  width: 56,
  height: 56,
}
const conversation = { source: require('@holi/ui/assets/img/onboarding/conversation.svg'), width: 62, height: 61 }
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
    <>
      <Animated.View style={[styles.imagesContainer, containerStyle]}>
        <Image
          source={require('@holi/ui/assets/img/onboarding/hero.png')}
          width={560}
          height={448}
          alt={t('onboarding.welcome.hero')}
          resizeMode="contain"
        />
        <Animated.View style={[styles.sparkles, iconsStyle]}>
          <Image alt="" source={sparkles.source} width={sparkles.width} height={sparkles.height} resizeMode="contain" />
        </Animated.View>
        <Animated.View style={[styles.conversation, iconsStyle]}>
          <Image
            alt=""
            source={conversation.source}
            width={conversation.width}
            height={conversation.height}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View style={[styles.highFive, iconsStyle]}>
          <Image alt="" source={highFive.source} width={highFive.width} height={highFive.height} resizeMode="contain" />
        </Animated.View>
      </Animated.View>
      <View style={styles.heroImageAlignment}>
        <Text size="4xl" headingLevel="1" numberOfLines={2}>
          {t('onboarding.welcome.title')}
        </Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  imagesContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginHorizontal: -64,
  },
  heroImageAlignment: {
    width: '100%',
    maxWidth: 600,
  },
  sparkles: {
    position: 'absolute',
    top: 26,
    left: 230,
  },
  conversation: {
    position: 'absolute',
    bottom: 50,
    left: 96,
  },
  highFive: {
    position: 'absolute',
    top: 148,
    right: 140,
  },
})

export default AnimatedIntro
