import { VolunteeringListingHeader } from '@holi-apps/volunteering/components/VolunteeringListingHeader'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { render, screen, userEvent, within } from 'expo-router/testing-library'
import React from 'react'

describe('VolunteeringListingHeader', () => {
  it('should render correct header for recommendations', () => {
    render(<VolunteeringListingHeader />)

    expect(screen.getByText('volunteering.discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.subline')).toBeOnTheScreen()
  })

  it('should render correct header when filtering', () => {
    render(<VolunteeringListingHeader isFiltering={true} totalResults={123} />)

    expect(screen.getByText('volunteering.filter.result')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.subline')).toBeOnTheScreen()
  })

  it('should open partner modal', async () => {
    jest.useFakeTimers()

    const expectedPartners = Object.keys(VOLUNTEERING_IMG_SOURCES_MAPPING)
    const user = userEvent.setup()

    render(<VolunteeringListingHeader />)

    await user.press(screen.getByText('volunteering.listing.subline'))

    const modal = screen.getByTestId('volunteering-partner-modal')
    expect(within(modal).getAllByRole('heading')).toHaveLength(expectedPartners.length)

    await user.press(screen.getByText('global.gotIt'))

    expect(screen.queryByTestId('volunteering-partner-modal')).not.toBeOnTheScreen()

    jest.useRealTimers()
  })
})
