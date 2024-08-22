import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import SpaceRecommendations from '@holi/core/screens/homeFeed/components/SpaceRecommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'
import VolunteeringRecosV1 from '@holi-apps/volunteering/components/VolunteeringRecosV1'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks'

const Recommendations = () => {
  const { t } = useTranslation()

  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const displayGoodNews = useFeatureFlagWithMaintenance(FeatureFlagKey.GOODNEWS).isOn
  const volunteeringVariant = useVolunteeringVariant()

  return (
    <View style={styles.container}>
      <HoliContainer>
        <HoliHeading size="l">{t('recommendations.title')}</HoliHeading>
      </HoliContainer>

      <ErrorBoundary>
        <HoliContainer>
          <SpaceRecommendations />
        </HoliContainer>
      </ErrorBoundary>

      <ErrorBoundary>
        <HoliContainer>
          <TaskRecommendations />
        </HoliContainer>
      </ErrorBoundary>

      {displayDonations && (
        <HoliContainer>
          <DonationUpdates style={styles.updatesContainer} />
        </HoliContainer>
      )}

      {volunteeringVariant === 'legacy' && (
        <HoliContainer>
          <VolunteeringUpdates style={styles.updatesContainer} />
        </HoliContainer>
      )}

      {volunteeringVariant === 'recosV1' && (
        <HoliContainer>
          <VolunteeringRecosV1 style={styles.updatesContainer} />
        </HoliContainer>
      )}

      {displayGoodNews && (
        <HoliContainer>
          <GoodNewsUpdates style={styles.updatesContainer} />
        </HoliContainer>
      )}
    </View>
  )
}

export default withProfiler(Recommendations, { name: 'Recommendations' })

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
