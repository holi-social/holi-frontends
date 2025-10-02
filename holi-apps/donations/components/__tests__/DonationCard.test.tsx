import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { DonationCard } from '@holi-apps/donations/components/DonationCard'
import { TrackingEvent } from '@holi/core/tracking'
import { localizedTypesenseDonation } from '@holi-apps/donations/components/__tests__/testData'

describe('DonationCard', () => {
  it('should render title and progress', () => {
    render(<DonationCard project={localizedTypesenseDonation} index={0} />)

    expect(screen.getByText(localizedTypesenseDonation.title)).toBeOnTheScreen()
    expect(screen.getByText('donations.donationProgress.percentFunded')).toBeOnTheScreen()
    expect(screen.getByText('donations.donationProgress.openAmount')).toBeOnTheScreen()
  })

  it('should render initiative', () => {
    render(<DonationCard project={localizedTypesenseDonation} index={0} />)

    expect(screen.getByText('donations.project.initiative')).toBeOnTheScreen()
  })

  it('should navigate on press to project', async () => {
    const user = userEvent.setup()

    render(<DonationCard project={localizedTypesenseDonation} index={0} />)

    await user.press(screen.getByRole('link'))

    expect(mockNavigate).toHaveBeenCalledWith('/donations/123')
  })

  it('tracks press on card', async () => {
    const user = userEvent.setup()

    render(<DonationCard project={localizedTypesenseDonation} index={13} />)

    await user.press(screen.getByRole('link'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('donation', '123', 13, {
        sourceSection: 'Donations',
      })
    )
  })
})
