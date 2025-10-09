import type React from 'react'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import { View, Animated, Easing, StyleSheet, type ViewStyle } from 'react-native'
import { Text } from 'holi-bricks/components/text'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { useTranslation } from 'react-i18next'

interface AnimationConfig {
  lottieDuration?: number
  /** Duration of the content fade-in animation in milliseconds (default: 800) */
  contentFadeDuration?: number
  /** Duration of the counter movement animation in milliseconds (default: 500) */
  counterMoveDuration?: number
  /** Duration of the label fade-in animation in milliseconds (default: 200) */
  labelFadeDuration?: number
  /** Custom easing function for animations (default: Easing.inOut(Easing.quad)) */
  easing?: (value: number) => number
}

interface GoodDeedsCounterAnimationProps {
  deedCount: number
  labelText: string
  testID?: string
  counterTestID?: string
  labelTestID?: string
  animationContainerStyle?: ViewStyle
  counterContainerStyle?: ViewStyle
  labelContainerStyle?: ViewStyle
  animationConfig?: AnimationConfig
  onAnimationStart?: () => void
  onAnimationComplete?: () => void
  accessibilityLabel?: string
  accessibilityHint?: string
  disabled?: boolean
}

const DEFAULT_ANIMATION_CONFIG: Required<AnimationConfig> = {
  lottieDuration: 2300,
  contentFadeDuration: 800,
  counterMoveDuration: 500,
  labelFadeDuration: 200,
  easing: Easing.inOut(Easing.quad),
}

const GoodDeedsCounterAnimation: React.FC<GoodDeedsCounterAnimationProps> = ({
  deedCount,
  labelText,
  testID,
  counterTestID,
  labelTestID,
  animationContainerStyle,
  counterContainerStyle,
  labelContainerStyle,
  animationConfig,
  onAnimationStart,
  onAnimationComplete,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
}) => {
  const { t } = useTranslation()
  const styles = useMemo(() => getStyles(), [])

  const config = useMemo(
    () => ({
      ...DEFAULT_ANIMATION_CONFIG,
      ...animationConfig,
    }),
    [animationConfig]
  )

  const previousCountValueMoveOut = useRef(new Animated.Value(0)).current
  const countValueMoveIn = useRef(new Animated.Value(0)).current
  const countLabelFadeIn = useRef(new Animated.Value(0)).current
  const contentFadeIn = useRef(new Animated.Value(0)).current

  const previousDeedCount = useMemo(() => Math.max(0, deedCount - 1), [deedCount])

  const isAnimationDisabled = disabled || deedCount < 0

  const startAnimation = useCallback(() => {
    if (isAnimationDisabled) {
      contentFadeIn.setValue(1)
      countValueMoveIn.setValue(1)
      countLabelFadeIn.setValue(1)
      onAnimationComplete?.()
      return
    }

    onAnimationStart?.()

    countValueMoveIn.setValue(0)
    contentFadeIn.setValue(0)
    countLabelFadeIn.setValue(0)

    Animated.timing(contentFadeIn, {
      toValue: 1,
      duration: config.contentFadeDuration,
      useNativeDriver: true,
      delay: config.lottieDuration,
    }).start(() => {
      Animated.timing(previousCountValueMoveOut, {
        toValue: 0,
        duration: config.counterMoveDuration,
        easing: config.easing,
        useNativeDriver: true,
      }).start()
      Animated.timing(countValueMoveIn, {
        toValue: 1,
        duration: config.counterMoveDuration,
        easing: config.easing,
        useNativeDriver: true,
      }).start()
      Animated.timing(countLabelFadeIn, {
        toValue: 1,
        duration: config.labelFadeDuration,
        easing: config.easing,
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete?.()
      })
    })
  }, [
    isAnimationDisabled,
    config,
    onAnimationStart,
    onAnimationComplete,
    contentFadeIn,
    countValueMoveIn,
    countLabelFadeIn,
    previousCountValueMoveOut,
  ])

  useEffect(() => {
    startAnimation()

    return () => {
      contentFadeIn.removeAllListeners()
      previousCountValueMoveOut.removeAllListeners()
      countValueMoveIn.removeAllListeners()
      countLabelFadeIn.removeAllListeners()
    }
  }, [startAnimation, contentFadeIn, previousCountValueMoveOut, countValueMoveIn, countLabelFadeIn])

  const containerAccessibilityProps = useMemo(
    () => ({
      accessibilityLabel:
        accessibilityLabel ||
        t('goodDeedsCounter.animation.accessibilityLabel', { count: deedCount, label: labelText }),
      accessibilityHint: accessibilityHint || t('goodDeedsCounter.animation.accessibilityHint'),
      accessibilityRole: 'text' as const,
    }),
    [accessibilityLabel, accessibilityHint, deedCount, labelText, t]
  )

  return (
    <View style={[styles.container, animationContainerStyle]} testID={testID} {...containerAccessibilityProps}>
      <View style={styles.iconContainer}>
        <HoliLottie animType="goodDeedsCounter" loop={false} />
      </View>

      <Animated.View
        style={[styles.animatedContainer, { opacity: contentFadeIn }, counterContainerStyle]}
        testID="good-deeds-counter-animation"
        accessibilityLabel={t('goodDeedsCounter.animation.previousCount', {
          previousCount: previousDeedCount,
          currentCount: deedCount,
        })}
      >
        <Animated.View
          style={{
            transform: [
              {
                translateY: Animated.add(
                  countValueMoveIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 140],
                  }),
                  previousCountValueMoveOut
                ),
              },
            ],
          }}
        >
          <Text headingLevel="1" size="5xl" bold>
            {previousDeedCount}
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            transform: [
              {
                translateY: Animated.add(
                  countValueMoveIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-140, 0],
                  }),
                  countValueMoveIn
                ),
              },
            ],
          }}
          testID={counterTestID || 'good-deeds-counter-final'}
          accessibilityLabel={t('goodDeedsCounter.animation.finalCount', { count: deedCount })}
        >
          <Text headingLevel="1" size="5xl" bold>
            {deedCount}
          </Text>
        </Animated.View>
      </Animated.View>

      <View style={[styles.countContainer, labelContainerStyle]}>
        <Animated.View
          style={{
            opacity: countValueMoveIn,
            width: '100%',
            alignItems: 'center',
          }}
          testID={labelTestID || 'good-deeds-counter-label'}
          accessibilityLabel={labelText}
        >
          <Text headingLevel="2" size="3xl">
            {labelText}
          </Text>
        </Animated.View>
      </View>
    </View>
  )
}

const getStyles = () =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      bottom: -16,
      width: 200,
      height: 130,
    },
    animatedContainer: {
      height: 140,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    countContainer: {
      top: -8,
      height: 40,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
  })

export type { GoodDeedsCounterAnimationProps, AnimationConfig }
export default GoodDeedsCounterAnimation
