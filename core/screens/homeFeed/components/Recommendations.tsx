import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import SpaceRecommendations from '@holi/core/screens/homeFeed/components/SpaceRecommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'
import VolunteeringRecosV1 from '@holi-apps/volunteering/components/VolunteeringRecosV1'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'

const IMAGE_WIDTH = 311

export const useCardWidth = () => {
  const { width: screenWidth } = useWindowDimensions()
  return Platform.OS === 'web' ? IMAGE_WIDTH : screenWidth / 1.3 - 30
}

const useSubtitle = (): string | undefined => {
  const loggedInUser = useLoggedInUser()
  if (loggedInUser.isLoggedIn) {
    const hasInterests = !!loggedInUser.user.interests && loggedInUser.user.interests.length > 0
    const hasSkills = !!loggedInUser.user.skills && loggedInUser.user.skills.length > 0
    const hasLocation = !!loggedInUser.user.location
    if (hasInterests && hasSkills && hasLocation) return 'recommendations.subtitle.interestsSkillsAndGeoLocation'
    else if (hasInterests && hasSkills) return 'recommendations.subtitle.interestsAndSkills'
    else if (hasInterests && hasLocation) return 'recommendations.subtitle.interestsAndLocation'
    else if (hasSkills && hasLocation) return 'recommendations.subtitle.skillsAndLocation'
    else if (hasInterests) return 'recommendations.subtitle.interestsOnly'
    else if (hasSkills) return 'recommendations.subtitle.skillsOnly'
    else if (hasLocation) return 'recommendations.subtitle.locationOnly'
    else return 'recommendations.subtitle.defaultTopics'
  } else {
    return 'recommendations.subtitle.defaultTopics'
  }
}

const RecommendationsHeader = () => {
  const { t } = useTranslation()
  const subtitle = useSubtitle()

  return (
    <HoliContainer>
      <HoliHeading size="l">{t('recommendations.title')}</HoliHeading>
      {subtitle && <HoliHeading size="m">{t(subtitle)}</HoliHeading>}
    </HoliContainer>
  )
}

const Recommendations = () => {
  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const displayGoodNews = useFeatureFlagWithMaintenance(FeatureFlagKey.GOODNEWS).isOn
  const volunteeringVariant = useVolunteeringVariant()
  const cardWidth = useCardWidth()

  return (
    <View style={styles.container}>
      <RecommendationsHeader />

      <ErrorBoundary>
        <HoliContainer>
          <SpaceRecommendations cardWidth={cardWidth} />
        </HoliContainer>
      </ErrorBoundary>

      <ErrorBoundary>
        <HoliContainer>
          <TaskRecommendations cardWidth={cardWidth} />
        </HoliContainer>
      </ErrorBoundary>

      {volunteeringVariant === 'legacy' && (
        <HoliContainer>
          <VolunteeringUpdates cardWidth={cardWidth} style={styles.updatesContainer} />
        </HoliContainer>
      )}

      {volunteeringVariant === 'recosV1' && (
        <HoliContainer>
          <VolunteeringRecosV1 cardWidth={cardWidth} style={styles.updatesContainer} />
        </HoliContainer>
      )}

      {displayDonations && (
        <HoliContainer>
          <DonationUpdates cardWidth={cardWidth} style={styles.updatesContainer} />
        </HoliContainer>
      )}

      {displayGoodNews && (
        <HoliContainer>
          <GoodNewsUpdates cardWidth={cardWidth} style={styles.updatesContainer} />
        </HoliContainer>
      )}
    </View>
  )
}

export default withProfiler(Recommendations, { name: 'Recommendations' })

export const exportedForTesting = {
  RecommendationsHeader,
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  updatesContainer: {
    flex: 1,
    minHeight: 'auto',
    paddingBottom: 12,
  },
})
