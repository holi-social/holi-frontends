import React from 'react'
import { renderRouter, screen, fireEvent } from 'expo-router/testing-library'
import { DonationCard } from '@holi-apps/donations/components/DonationCard'
import { TrackingEvent } from '@holi/core/tracking'
import { localizedTypesenseDonation } from '@holi-apps/donations/components/__tests__/testData'
import { Text } from 'react-native'

describe('DonationCard', () => {
  it('should render title and progress', () => {
    renderRouter({ index: () => <DonationCard project={localizedTypesenseDonation} index={0} /> })

    expect(screen.getByText(localizedTypesenseDonation.title)).toBeOnTheScreen()
    expect(screen.getByText('donations.donationProgress.percentFunded')).toBeOnTheScreen()
    expect(screen.getByText('donations.donationProgress.openAmount')).toBeOnTheScreen()
  })

  it('should render initiative', () => {
    renderRouter({ index: () => <DonationCard project={localizedTypesenseDonation} index={0} /> })

    expect(screen.getByText('donations.project.initiative')).toBeOnTheScreen()
  })

  it('should navigate on press to project', () => {
    const context = renderRouter({
      index: () => <DonationCard project={localizedTypesenseDonation} index={0} />,
      'donations/[id]': () => <Text>Donation</Text>,
    })

    fireEvent.press(screen.getByRole('link'))

    expect(context).toHavePathname('/donations/123')
  })

  it('tracks press on card', () => {
    renderRouter({
      index: () => <DonationCard project={localizedTypesenseDonation} index={13} />,
      'donations/[id]': () => <Text>Donation</Text>,
    })

    fireEvent.press(screen.getByRole('link'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('donation', '123', 13, {
        sourceSection: 'Donations',
      })
    )
  })
})
