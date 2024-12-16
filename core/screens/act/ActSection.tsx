import React from 'react'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'

import RecommendedChallenges from '@holi-apps/challenges/components/RecommendedChallenges'
import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import VolunteeringRecos from '@holi-apps/volunteering/components/VolunteeringRecos'

export const ActSection = ({ type }: { type: string }) => {
  const cardWidth = useCardWidth()
  const displayVolunteering = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING).isOn
  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn

  switch (type) {
    case 'CHALLENGES':
      return (
        <ErrorBoundary>
          <RecommendedChallenges />
        </ErrorBoundary>
      )
    case 'VOLUNTEERING':
      return (
        <>
          {displayVolunteering && (
            <ErrorBoundary>
              <VolunteeringRecos cardWidth={cardWidth} />
            </ErrorBoundary>
          )}

          <ErrorBoundary>
            <TaskRecommendations cardWidth={cardWidth} />
          </ErrorBoundary>
        </>
      )
    case 'DONATIONS':
      return (
        <>
          {displayDonations && (
            <ErrorBoundary>
              <DonationUpdates cardWidth={cardWidth} />
            </ErrorBoundary>
          )}
        </>
      )
  }
}
