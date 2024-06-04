import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import SpaceRecommendations from '@holi/core/screens/homeFeed/components/SpaceRecommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'

const Recommendations = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <HoliContainer>
        <HoliHeading size="l">{t('recommendations.title')}</HoliHeading>
      </HoliContainer>

      <HoliContainer>
        <SpaceRecommendations />
      </HoliContainer>

      <HoliContainer>
        <TaskRecommendations />
      </HoliContainer>

      <HoliContainer>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_DONATIONS}
          featureNameKey="donations:maintenance.feature"
          noLayout
        >
          <DonationUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
      </HoliContainer>

      <HoliContainer>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_VOLUNTEERING}
          featureNameKey="volunteering:maintenance.feature"
          noLayout
        >
          <VolunteeringUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
      </HoliContainer>

      <HoliContainer>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_GOODNEWS}
          featureNameKey="goodnews:maintenance.feature"
          noLayout
        >
          <GoodNewsUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
      </HoliContainer>
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
