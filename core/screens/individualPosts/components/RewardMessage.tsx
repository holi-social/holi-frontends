import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Pressable, Linking, Animated, Easing } from 'react-native'
import { useTranslation } from 'react-i18next'

import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { LinkM } from '@holi/icons/src/generated'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'

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
  const [displayCount, setDisplayCount] = useState(0)

  // counter animation
  useEffect(() => {
    const finalCount = goodDeedCount || 1

    // Start from previous count (goodDeedCount - 1)
    countAnim.setValue(goodDeedCount - 1)

    // Initialize display count to starting value
    setDisplayCount(goodDeedCount - 1)

    countAnim.addListener(({ value }) => {
      setDisplayCount(Math.floor(value))
    })

    // Fade in the view immediately
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()

    // Create a sequence of animations that flow seamlessly
    Animated.sequence([
      // Initial bounce down
      Animated.timing(initialBounceAnim, {
        toValue: -50,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Return to normal position
      Animated.timing(initialBounceAnim, {
        toValue: 0,
        duration: 75,
        useNativeDriver: true,
      }),
      // Start the counter animation immediately after the bounce
      Animated.timing(countAnim, {
        toValue: finalCount,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Add bounce effect when counter animation completes
      Animated.sequence([
        // Add vertical bounce - move up
        Animated.timing(verticalBounceAnim, {
          toValue: 8,
          duration: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Settle back to normal position
        Animated.timing(verticalBounceAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    })

    return () => {
      countAnim.removeAllListeners()
    }
  }, [fadeAnim, countAnim, bounceAnim, verticalBounceAnim, initialBounceAnim, goodDeedCount])

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
        <View style={{ height: 140, overflow: 'hidden', width: 140 }}>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: Animated.add(
                    countAnim.interpolate({
                      inputRange: [goodDeedCount - 1, goodDeedCount],
                      outputRange: [0, 140],
                    }),
                    initialBounceAnim
                  ),
                },
              ],
            }}
          >
            <Text headingLevel="1" size="5xl" bold>
              {goodDeedCount - 1}
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              transform: [
                {
                  translateY: Animated.add(
                    countAnim.interpolate({
                      inputRange: [goodDeedCount - 1, goodDeedCount],
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
          {displayCount > 1 || displayCount === 0 ? (
            <Text headingLevel="2" size="3xl">
              {t('goodDeeds.name')}
            </Text>
          ) : (
            <Text headingLevel="2" size="3xl">
              {t('goodDeedsCounter.label.single')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.subContent}>
        <View style={styles.descriptionContainer}>
          <Text size="xl">{t('goodDeed.rewardsMessage.text')}</Text>
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
      paddingHorizontal: dimensions.spacingML,
    },
    content: {
      flex: 4,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    countContainer: {
      top: -8,
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
      marginBottom: dimensions.spacingS,
      maxWidth: 320,
    },
    moreInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: dimensions.spacingXxs,
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: dimensions.spacingM,
      paddingVertical: dimensions.spacingL,
      maxWidth: dimensions.breakpointS,
    },
  })

export default RewardMessage
