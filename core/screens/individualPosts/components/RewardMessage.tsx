import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Pressable, Linking, Animated, Easing } from 'react-native'
import { useTranslation } from 'react-i18next'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { LinkM } from '@holi/icons/src/generated'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { breakpoints, Spacing } from 'holi-bricks/foundations'

interface RewardMessageProps {
  campaignTag?: string
  goodDeedCount?: number
  onClaim?: () => void
}

const RewardMessage: React.FC<RewardMessageProps> = ({
  campaignTag = '#1MioguteTaten',
  goodDeedCount = 1,
  onClaim,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = React.useMemo(() => getStyles(theme), [theme])
  const fadeAnim = useRef(new Animated.Value(0)).current
  const countAnim = useRef(new Animated.Value(0)).current
  const bounceAnim = useRef(new Animated.Value(1)).current
  const verticalBounceAnim = useRef(new Animated.Value(0)).current
  const initialBounceAnim = useRef(new Animated.Value(0)).current
  const textFadeAnim = useRef(new Animated.Value(0)).current // Animation for text transition
  const [labelText, setLabelText] = useState('') // State for the label text
  const [showText, setShowText] = useState(true) // Control text visibility

  useEffect(() => {
    const initialCount = Math.max(0, goodDeedCount - 1)
    setLabelText(
      initialCount > 1 || initialCount === 0 ? t('goodDeeds.name.plural_other') : t('goodDeedsCounter.label.single')
    )
  }, [goodDeedCount, t])

  // counter animation
  useEffect(() => {
    const finalCount = goodDeedCount || 1

    countAnim.setValue(Math.max(0, goodDeedCount - 1))
    textFadeAnim.setValue(1)
    setShowText(true)

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start()

    // Text fade out
    setTimeout(() => {
      // Fade out text
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        // Hide text completely for 300ms
        setShowText(false)

        // After pause, update text and fade back in
        setTimeout(() => {
          setLabelText(goodDeedCount > 1 ? t('goodDeeds.name.plural_other') : t('goodDeedsCounter.label.single'))
          setShowText(true)
        }, 200)
      })
    }, 3000) // Delayed further to 2500ms to end even later

    // Wait for Lottie animation
    setTimeout(() => {
      // Counter animation sequence - total 0.8s as specified
      Animated.sequence([
        // Initial bounce
        Animated.timing(initialBounceAnim, {
          toValue: -50,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(initialBounceAnim, {
          toValue: 0,
          duration: 120,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(countAnim, {
          toValue: finalCount,
          duration: 280,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.sequence([
          // Small final bounce - total 0.3s to finish the animation
          Animated.timing(verticalBounceAnim, {
            toValue: 5,
            duration: 80,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(verticalBounceAnim, {
            toValue: 0,
            duration: 150,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start()
      })
    }, 2700)

    return () => {
      countAnim.removeAllListeners()
    }
  }, [fadeAnim, countAnim, bounceAnim, verticalBounceAnim, initialBounceAnim, goodDeedCount, textFadeAnim, t])

  const handleMoreInfoPress = () => {
    if (campaignTag) {
      Linking.openURL('https://holi.social/gute-taten')
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <HoliLottie animType="goodDeedsCounter" loop={false} />
        </View>
        <View style={styles.animatedContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: Animated.add(
                    countAnim.interpolate({
                      inputRange: [Math.max(0, goodDeedCount - 1), goodDeedCount],
                      outputRange: [0, 140],
                    }),
                    initialBounceAnim
                  ),
                },
              ],
            }}
          >
            <Text headingLevel="1" size="5xl" bold>
              {Math.max(0, goodDeedCount - 1)}
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              transform: [
                {
                  translateY: Animated.add(
                    countAnim.interpolate({
                      inputRange: [Math.max(0, goodDeedCount - 1), goodDeedCount],
                      outputRange: [-140, 0],
                    }),
                    verticalBounceAnim
                  ),
                },
              ],
            }}
          >
            <Text headingLevel="1" size="5xl" bold>
              {goodDeedCount}
            </Text>
          </Animated.View>
        </View>
        <View style={styles.countContainer}>
          {showText && (
            <Animated.View
              style={{
                opacity: 1,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text headingLevel="2" size="3xl">
                {labelText}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      <View style={styles.subContent}>
        <View style={styles.descriptionContainer}>
          <Text size="xl" textAlign="center">
            {t('goodDeed.rewardsMessage.text')}
          </Text>
        </View>
        <Pressable style={styles.moreInfoContainer} onPress={handleMoreInfoPress}>
          <Text size="lg" bold>
            {t('goodDeed.rewardsMessage.link')}
          </Text>
          <LinkM width={24} height={24} color={theme.colors.black300} />
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Button label={t('goodDeed.rewardsMessage.button', 'Claim')} onPress={onClaim} size="md" />
      </View>
    </Animated.View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background10,
      flex: 1,
    },
    holiContainer: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
    },
    subContent: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
    },
    content: {
      flex: 4,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    countContainer: {
      top: -8,
      height: 40,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      bottom: -16,
      width: 200,
      height: 130,
    },
    descriptionContainer: {
      textAlign: 'center',
      marginBottom: Spacing.xs,
      maxWidth: 320,
    },
    moreInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xl,
      maxWidth: breakpoints.sm,
    },
    animatedContainer: { height: 140, overflow: 'hidden', width: 140, alignItems: 'center', justifyContent: 'center' },
  })

export default RewardMessage
