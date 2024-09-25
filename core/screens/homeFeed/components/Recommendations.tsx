import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import SpaceRecommendations from '@holi/core/screens/homeFeed/components/SpaceRecommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { dimensions } from '@holi/ui/styles/globalVars'

import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'
import VolunteeringRecos from '@holi-apps/volunteering/components/VolunteeringRecos'

const IMAGE_WIDTH = 311

export const useCardWidth = () => {
  const { width: screenWidth } = useWindowDimensions()
  return Platform.OS === 'web' ? IMAGE_WIDTH : screenWidth / 1.3 - 30
}

const RecommendationsHeader = () => {
  const { t } = useTranslation()
  const subtitle = useRecosSubtitle()

  return (
    <HoliContainer>
      <HoliHeading size="l">{t('recommendations.title')}</HoliHeading>
      {subtitle && <HoliHeading size="m">{t(subtitle)}</HoliHeading>}
    </HoliContainer>
  )
}

const Recommendations = () => {
  const displayVolunteering = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING).isOn
  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const displayGoodNews = useFeatureFlagWithMaintenance(FeatureFlagKey.GOODNEWS).isOn
  const cardWidth = useCardWidth()

  return (
    <View>
      <RecommendationsHeader />
      <HoliGap />
      <View style={styles.container}>
        <ErrorBoundary>
          <SpaceRecommendations cardWidth={cardWidth} />
        </ErrorBoundary>

        <ErrorBoundary>
          <TaskRecommendations cardWidth={cardWidth} />
        </ErrorBoundary>

        {displayVolunteering && <VolunteeringRecos cardWidth={cardWidth} />}

        {displayDonations && <DonationUpdates cardWidth={cardWidth} />}

        {displayGoodNews && <GoodNewsUpdates cardWidth={cardWidth} />}
      </View>
    </View>
  )
}

export default withProfiler(Recommendations, { name: 'Recommendations' })

const styles = StyleSheet.create({
  container: {
    gap: dimensions.spacingL,
  },
})
