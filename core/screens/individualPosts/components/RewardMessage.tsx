import React, { useEffect, useRef } from 'react'
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
  deedCount?: number
  onClaim?: () => void
}

const RewardMessage: React.FC<RewardMessageProps> = ({ campaignTag = '#1MioguteTaten', deedCount = 0, onClaim }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = React.useMemo(() => getStyles(theme), [theme])
  const previousCountValueMoveOut = useRef(new Animated.Value(0)).current
  const countValueMoveIn = useRef(new Animated.Value(0)).current
  const countLabelFadeIn = useRef(new Animated.Value(0)).current
  const contentFadeIn = useRef(new Animated.Value(0)).current

  const previousDeedCount = Math.max(0, deedCount - 1)
  const labelText = t('goodDeeds.name', { count: deedCount })

  const LOTTIE_HAND_ANIMATION_DURATION = 2300

  useEffect(() => {
    countValueMoveIn.setValue(0)
    contentFadeIn.setValue(0)
    countLabelFadeIn.setValue(0)

    Animated.timing(contentFadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: LOTTIE_HAND_ANIMATION_DURATION,
    }).start(() => {
      Animated.timing(previousCountValueMoveOut, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start()
      Animated.timing(countValueMoveIn, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start()
      Animated.timing(countLabelFadeIn, {
        toValue: 1,
        duration: 200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start()
    })

    return () => {
      contentFadeIn.removeAllListeners()
      previousCountValueMoveOut.removeAllListeners()
      countValueMoveIn.removeAllListeners()
      countLabelFadeIn.removeAllListeners()
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMoreInfoPress = () => {
    if (campaignTag) {
      Linking.openURL('https://holi.social/gute-taten')
    }
  }

  return (
    <View style={[styles.container]} testID="reward-message-container">
      <Animated.View style={styles.content}>
        <View style={styles.iconContainer}>
          <HoliLottie animType="goodDeedsCounter" loop={false} />
        </View>
        <Animated.View
          style={[styles.animatedContainer, { opacity: contentFadeIn }]}
          testID="good-deeds-counter-animation"
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
            testID="good-deeds-counter-final"
          >
            <Text headingLevel="1" size="5xl" bold>
              {deedCount}
            </Text>
          </Animated.View>
        </Animated.View>
        <View style={styles.countContainer}>
          <Animated.View
            style={{
              opacity: countValueMoveIn,
              width: '100%',
              alignItems: 'center',
            }}
            testID="good-deeds-counter-label"
          >
            <Text headingLevel="2" size="3xl">
              {labelText}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>

      <View style={styles.subContent}>
        <View style={styles.descriptionContainer}>
          <Text size="xl" textAlign="center" testID="reward-message-text">
            {t('goodDeed.rewardsMessage.text')}
          </Text>
        </View>
        <Pressable style={styles.moreInfoContainer} onPress={handleMoreInfoPress} testID="reward-message-link">
          <Text size="lg" bold>
            {t('goodDeed.rewardsMessage.link')}
          </Text>
          <LinkM width={24} height={24} color={theme.colors.black300} />
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          label={t('goodDeed.rewardsMessage.button', 'Claim')}
          onPress={onClaim}
          size="md"
          testID="reward-claim-button"
        />
      </View>
    </View>
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
    animatedContainer: { height: 140, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  })

export default RewardMessage
