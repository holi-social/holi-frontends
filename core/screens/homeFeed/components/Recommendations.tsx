import { withProfiler } from '@sentry/react'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagAB } from '@holi/core/featureFlags/hooks/useFeatureFlagAB'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import SpaceRecommendations from '@holi/core/screens/homeFeed/components/SpaceRecommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
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
      <Text headingLevel="2" size="3xl">
        {t('recommendations.title')}
      </Text>
      <HoliGap size="xs" />
      {subtitle && (
        <Text size="md" color="support">
          {t(subtitle)}
        </Text>
      )}
    </HoliContainer>
  )
}

const useRecoOrderAB = (): 'loading' | 'tasksFirst' | 'volunteeringFirst' | 'tasksOnly' => {
  const displayVolunteering = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING).isOn
  const homeTaskOrderSwapExperimentCohort = useFeatureFlagAB(FeatureFlagKey.HOME_TASK_ORDER_SWAP)

  if (!displayVolunteering) return 'tasksOnly'
  else {
    switch (homeTaskOrderSwapExperimentCohort) {
      case 'control':
        return 'tasksFirst'
      case 'test':
        return 'volunteeringFirst'
      case undefined:
        return 'loading'
    }
  }
}

const Recommendations = () => {
  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const displayGoodNews = useFeatureFlagWithMaintenance(FeatureFlagKey.GOODNEWS).isOn
  const recoOrderAB = useRecoOrderAB()
  const cardWidth = useCardWidth()

  return (
    <View>
      <RecommendationsHeader />
      <HoliGap />
      <View style={styles.container}>
        <ErrorBoundary>
          <SpaceRecommendations cardWidth={cardWidth} />
        </ErrorBoundary>

        {recoOrderAB === 'tasksOnly' && (
          <ErrorBoundary>
            <TaskRecommendations cardWidth={cardWidth} />
          </ErrorBoundary>
        )}

        {recoOrderAB === 'tasksFirst' && (
          <>
            <ErrorBoundary>
              <TaskRecommendations cardWidth={cardWidth} />
            </ErrorBoundary>
            <ErrorBoundary>
              <VolunteeringRecos cardWidth={cardWidth} />
            </ErrorBoundary>
          </>
        )}

        {recoOrderAB === 'volunteeringFirst' && (
          <>
            <ErrorBoundary>
              <VolunteeringRecos cardWidth={cardWidth} />
            </ErrorBoundary>
            <ErrorBoundary>
              <TaskRecommendations cardWidth={cardWidth} />
            </ErrorBoundary>
          </>
        )}

        {displayDonations && (
          <ErrorBoundary>
            <DonationUpdates cardWidth={cardWidth} />
          </ErrorBoundary>
        )}

        {displayGoodNews && (
          <ErrorBoundary>
            <GoodNewsUpdates cardWidth={cardWidth} />
          </ErrorBoundary>
        )}
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
