import React from 'react'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'

import RecommendedChallenges from '@holi-apps/challenges/components/RecommendedChallenges'
import DonationCarousel from '@holi-apps/donations/components/DonationCarousel'
import VolunteeringRecos from '@holi-apps/volunteering/components/VolunteeringRecos'
import EventCarousel from '@holi-apps/events/components/EventCarousel'
import { useRecoCardWidth } from '@holi/core/helpers/useRecoCardWidth'
import PetitionCarousel from '@holi/core/screens/act/petitions/PetitionCarousel'
import StartSmallCarousel from '@holi/core/components/StartSmallCarousel'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

export enum ActSectionType {
  VOLUNTEERING = 'VOLUNTEERING',
  CHALLENGES = 'CHALLENGES',
  EVENTS = 'EVENTS',
  DONATIONS = 'DONATIONS',
  PETITIONS = 'PETITIONS',
  STARTSMALL = 'STARTSMALL',
}

export const ActSection = ({ type }: { type: ActSectionType }) => {
  const cardWidth = useRecoCardWidth()
  const displayVolunteering = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING).isOn
  const displayDonations = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const displayEvents = useFeatureFlagWithMaintenance(FeatureFlagKey.EVENTS).isOn
  const displayPetitions = useFeatureFlagWithMaintenance(FeatureFlagKey.PETITIONS).isOn
  const displayStartSmallCarousel = useFeatureFlag(FeatureFlagKey.START_SMALL_CAROUSEL)

  switch (type) {
    case ActSectionType.STARTSMALL:
      return (
        displayStartSmallCarousel && (
          <ErrorBoundary>
            <StartSmallCarousel />
          </ErrorBoundary>
        )
      )
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
              <VolunteeringRecos cardWidth={cardWidth} rows={3} columns={4} />
            </ErrorBoundary>
          )}
        </>
      )
    case ActSectionType.PETITIONS:
      return (
        displayPetitions && (
          <ErrorBoundary>
            <PetitionCarousel cardWidth={cardWidth} />
          </ErrorBoundary>
        )
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

    case ActSectionType.DONATIONS:
      return (
        <>
          {displayDonations && (
            <ErrorBoundary>
              <DonationCarousel cardWidth={cardWidth} />
            </ErrorBoundary>
          )}
        </>
      )
  }
}
