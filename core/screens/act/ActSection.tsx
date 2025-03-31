import React from 'react'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import TaskRecommendations from '@holi/core/screens/homeFeed/components/TaskRecommendations'

import RecommendedChallenges from '@holi-apps/challenges/components/RecommendedChallenges'
import DonationUpdates from '@holi-apps/donations/components/DonationUpdates'
import VolunteeringRecos from '@holi-apps/volunteering/components/VolunteeringRecos'
import EventCarousel from '@holi-apps/events/components/EventCarousel'

export enum ActSectionType {
  VOLUNTEERING = 'VOLUNTEERING',
  CHALLENGES = 'CHALLENGES',
  EVENTS = 'EVENTS',
  TASKS = 'TASKS',
  DONATIONS = 'DONATIONS',
}

export const ActSection = ({ type }: { type: ActSectionType }) => {
  const cardWidth = useCardWidth()
  const displayVolunteering = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING).isOn
  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const displayEvents = useFeatureFlagWithMaintenance(FeatureFlagKey.EVENTS).isOn

  switch (type) {
    case ActSectionType.CHALLENGES:
      return (
        <ErrorBoundary>
          <RecommendedChallenges />
        </ErrorBoundary>
      )
    case ActSectionType.VOLUNTEERING:
      return (
        <>
          {displayVolunteering && (
            <ErrorBoundary>
              <VolunteeringRecos cardWidth={cardWidth} />
            </ErrorBoundary>
          )}
        </>
      )
    case ActSectionType.EVENTS:
      return (
        <>
          {displayEvents && (
            <ErrorBoundary>
              <EventCarousel cardWidth={cardWidth} />
            </ErrorBoundary>
          )}
        </>
      )
    case ActSectionType.TASKS:
      return (
        <ErrorBoundary>
          <TaskRecommendations cardWidth={cardWidth} />
        </ErrorBoundary>
      )

    case ActSectionType.DONATIONS:
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
