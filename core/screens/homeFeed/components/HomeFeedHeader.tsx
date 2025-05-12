import { withProfiler } from '@sentry/react'
import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import AnnouncementBanner from '@holi/core/screens/homeFeed/components/AnnouncementBanner'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'
import { useFeatureFlagAB } from '@holi/core/featureFlags/hooks/useFeatureFlagAB'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import ProfileCompletionCard from '@holi/core/screens/userprofile/components/ProfileCompletionCard'
import { Stack } from 'holi-bricks/components/stack'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import ChallengesCarousel from '@holi-apps/challenges/components/feed/ChallengesCarousel'
import Spacing from '@holi/ui/foundations/Spacing'

interface HomeFeedHeaderProps {
  refreshing?: boolean
}

const HomeFeedHeader = ({ refreshing }: HomeFeedHeaderProps) => {
  const displayNewHomeFeed = useFeatureFlagAB(FeatureFlagKey.NEW_HOME_FEED)
  const displayChallengesCarousel = useFeatureFlag(FeatureFlagKey.CHALLENGES_CAROUSEL)
  const { t } = useTranslation()

  const bannerShowCutoff = new Date(2024, 3, 12, 0, 0, 0)

  return (
    <Stack gap="md" margin={{ bottom: '3xs' }}>
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

      <HoliBox padding={[Spacing.sm, 0, 0, 0]} layout={styles.container} testID="home-feed-insights-heading">
        {displayChallengesCarousel[0] && <ChallengesCarousel refreshing={refreshing} />}
        {displayNewHomeFeed === 'test' && <AttendingChallengeEvents />}
        <ProfileCompletionCard page="home_feed" />
      </HoliBox>
    </Stack>
  )
}

export default withProfiler(HomeFeedHeader, { name: 'HomeFeedHeader' })

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
})
