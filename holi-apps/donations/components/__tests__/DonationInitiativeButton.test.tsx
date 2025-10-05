import React from 'react'
import { localizedTypesenseDonation } from '@holi-apps/donations/components/__tests__/testData'
import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import { render, screen, userEvent } from 'expo-router/testing-library'

describe('DonationInitiativeButton', () => {
  it('should link to organizer url', async () => {
    const user = userEvent.setup()
    render(<DonationInitiativeButton project={localizedTypesenseDonation} />)

    await user.press(screen.getByTestId('donations-project-initiative-btn'))

    expect(mockOpenURL).toHaveBeenCalledWith('https://example.com/donation/organizer')
  })

  it('should render organizer location', () => {
    render(<DonationInitiativeButton project={localizedTypesenseDonation} />)

    expect(screen.getByText('Bern, Switzerland')).toBeOnTheScreen()
  })
})
