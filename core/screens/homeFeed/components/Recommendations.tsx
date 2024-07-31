import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import SpaceRecommendations from '@holi/core/screens/homeFeed/components/SpaceRecommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'

const Recommendations = () => {
  const { t } = useTranslation()

  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const displayGoodNews = useFeatureFlagWithMaintenance(FeatureFlagKey.GOODNEWS).isOn
  const displayVolunteering = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING).isOn

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
          <PosthogFeatureFlagGuard
            featureFlagKey={FeatureFlagKey.DONATIONS}
            i18nKey="donations:maintenance.feature"
            noLayout
          >
            <DonationUpdates style={styles.updatesContainer} />
          </PosthogFeatureFlagGuard>
        </HoliContainer>
      )}

      {displayVolunteering && (
        <HoliContainer>
          <PosthogFeatureFlagGuard
            featureFlagKey={FeatureFlagKey.VOLUNTEERING}
            i18nKey="volunteering:maintenance.feature"
            noLayout
          >
            <VolunteeringUpdates style={styles.updatesContainer} />
          </PosthogFeatureFlagGuard>
        </HoliContainer>
      )}

      {displayGoodNews && (
        <HoliContainer>
          <PosthogFeatureFlagGuard
            featureFlagKey={FeatureFlagKey.GOODNEWS}
            i18nKey="goodnews:maintenance.feature"
            noLayout
          >
            <GoodNewsUpdates style={styles.updatesContainer} />
          </PosthogFeatureFlagGuard>
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
