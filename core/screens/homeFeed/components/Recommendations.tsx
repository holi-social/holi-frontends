import { withProfiler } from '@sentry/react'
import React from 'react'
import { Platform, View, useWindowDimensions } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

import GoodNewsUpdates from '@holi-apps/goodnews/components/GoodNewsUpdates'

const IMAGE_WIDTH = 311

export const useCardWidth = () => {
  const { width: screenWidth } = useWindowDimensions()
  return Platform.OS === 'web' ? IMAGE_WIDTH : screenWidth / 1.3 - 30
}

const Recommendations = () => {
  const displayGoodNews = useFeatureFlagWithMaintenance(FeatureFlagKey.GOODNEWS).isOn
  const cardWidth = useCardWidth()

  return (
    <View>
      <HoliGap />
      {displayGoodNews && (
        <ErrorBoundary>
          <GoodNewsUpdates cardWidth={cardWidth} />
        </ErrorBoundary>
      )}
    </View>
  )
}

export default withProfiler(Recommendations, { name: 'Recommendations' })
