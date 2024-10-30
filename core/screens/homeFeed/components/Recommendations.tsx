import { withProfiler } from '@sentry/react'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
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
  const { styles } = useStyles(stylesheet)

  return (
    <HoliContainer>
      <Text headingLevel="2" size="3xl">
        {t('recommendations.title')}
      </Text>
      <HoliGap size="xs" />
      {subtitle && (
        <Text size="md" color={styles.subtitle.color}>
          {t(subtitle)}
        </Text>
      )}
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

const stylesheet = createStyleSheet((theme) => ({
  subtitle: {
    color: theme.colors.textSecondary,
  },
}))
