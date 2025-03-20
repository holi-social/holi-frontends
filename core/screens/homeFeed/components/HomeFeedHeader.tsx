import { withProfiler } from '@sentry/react'
import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useIsFocused } from '@holi/core/helpers/useIsFocused'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import AnnouncementBanner from '@holi/core/screens/homeFeed/components/AnnouncementBanner'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'
import ProfileCompletionCard from '@holi/core/screens/userprofile/components/ProfileCompletionCard'

const HomeFeedHeader: React.FC<{ displayNewHomeFeed?: 'control' | 'test' }> = ({ displayNewHomeFeed }) => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const { user, isLoading } = useLoggedInUser()
  const bannerShowCutoff = new Date(2024, 3, 12, 0, 0, 0)
  const rotation = useSharedValue(0)

  const rotationStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }),
    []
  )

  useEffect(() => {
    if (!isLoading && isFocused) {
      rotation.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 1500 }),

          withTiming(20, { easing: Easing.inOut(Easing.sin), duration: 200 }),
          withTiming(-20, { easing: Easing.inOut(Easing.sin), duration: 200 }),
          withTiming(26, { easing: Easing.inOut(Easing.sin), duration: 200 }),
          withTiming(-26, { easing: Easing.inOut(Easing.sin), duration: 200 }),
          withSpring(0, { damping: 8, stiffness: 70 }),
          withTiming(0, { duration: 15000 })
        ),
        2,
        true
      )
    }
  }, [isLoading, isFocused, rotation])

  return (
    <View style={styles.headerContainer}>
      {new Date() < bannerShowCutoff && (
        <>
          <HoliGap size="s" />
          <AnnouncementBanner>
            <Text size="md">
              <Trans t={t} i18nKey="homeFeed.banner.privacyPolicyUpdated">
                <HoliTextLink
                  label={t('profile.settings.legalDocuments.privacyPolicy')}
                  href="/profile/settings/legalDocuments/document?type=privacyPolicy"
                  size="md"
                >
                  {t('profile.settings.legalDocuments.privacyPolicy')}
                </HoliTextLink>
              </Trans>
            </Text>
          </AnnouncementBanner>
        </>
      )}

      {/*Headline */}
      <HoliBox padding={[32, 0, 8, 0]} layout={styles.headlineContainer} testID="home-feed-insights-heading">
        <Text size="3xl" headingLevel="2">
          {user?.firstName ? t('homeFeed.heading.loggedIn', { firstname: user?.firstName }) : t('homeFeed.heading')}
        </Text>
        {/* start waving animation after user state has been loaded and the screen is focused/active */}
        <Animated.View style={[!isLoading && isFocused && rotationStyle, { transformOrigin: 'center bottom' }]}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/icons/hand-wave-filled.svg')}
            width={40}
            height={40}
            label={''}
            style={styles.handwaveFilled}
            isSvg
          />
        </Animated.View>
      </HoliBox>
      <ProfileCompletionCard style={styles.container} page="home_feed" />
      {displayNewHomeFeed === 'test' && <AttendingChallengeEvents />}
    </View>
  )
}

export default withProfiler(HomeFeedHeader, { name: 'HomeFeedHeader' })

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0,
    alignSelf: 'stretch',
  },
  headlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handwaveFilled: {
    paddingLeft: 8,
  },
  container: {
    marginTop: 16,
  },
})
