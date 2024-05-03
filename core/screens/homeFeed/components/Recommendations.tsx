import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import SpaceRecommendations from '@holi/core/screens/homeFeed/components/SpaceRecommendations'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'
import VolunteeringUpdates from '@holi-apps/volunteering/components/VolunteeringUpdates'

const Recommendations = () => {
  const { t } = useTranslation()

  return (
    <HoliBox padding={[32, 0, 0, 0]}>
      <HoliContainer gap={24}>
        <HoliHeading size="l">{t('recommendations.title')}</HoliHeading>
        <SpaceRecommendations />
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_DONATIONS}
          featureNameKey="donations:maintenance.feature"
          noLayout
        >
          <DonationUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_VOLUNTEERING}
          featureNameKey="volunteering:maintenance.feature"
          noLayout
        >
          <VolunteeringUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
        <FeatureToggleGuard
          toggleName={FeatureToggleName.APPS_GOODNEWS}
          featureNameKey="goodnews:maintenance.feature"
          noLayout
        >
          <GoodNewsUpdates style={styles.updatesContainer} />
        </FeatureToggleGuard>
      </HoliContainer>
    </HoliBox>
  )
}

export default withProfiler(Recommendations, { name: 'Recommendations' })

const styles = StyleSheet.create({
  updatesContainer: {
    flex: 1,
    minHeight: 'auto',
    paddingBottom: 12,
  },
  maintenance: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})
