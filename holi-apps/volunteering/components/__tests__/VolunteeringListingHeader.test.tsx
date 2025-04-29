import { VolunteeringListingHeader } from '@holi-apps/volunteering/components/VolunteeringListingHeader'
import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import { render, screen, userEvent, within } from '@testing-library/react-native'
import React from 'react'

const mockUseRecosSubtitle = jest.mocked(useRecosSubtitle)
jest.mock('@holi/core/hooks/useRecosSubtitle', () => ({
  useRecosSubtitle: jest.fn(),
}))

describe('VolunteeringListingHeader', () => {
  beforeEach(() => {
    mockUseRecosSubtitle.mockReturnValue('Recos subtitle')
  })

  it('should render correct header for recommendations', () => {
    render(<VolunteeringListingHeader />)

    expect(screen.getByText('discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('listing.subline')).toBeOnTheScreen()
    expect(screen.getByText('Recos subtitle')).toBeOnTheScreen()
    expect(screen.queryByText('filter.result')).not.toBeOnTheScreen()
  })

  it('should render correct header when filtering', () => {
    render(<VolunteeringListingHeader isFiltering={true} totalResults={123} />)

    expect(screen.getByText('discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('listing.subline')).toBeOnTheScreen()
    expect(screen.getByText('filter.result')).toBeOnTheScreen()
    expect(screen.queryByText('Recos subtitle')).not.toBeOnTheScreen()
  })

  it('should open partner modal', async () => {
    jest.useFakeTimers()

    const expectedPartners = Object.keys(VOLUNTEERING_IMG_SOURCES_MAPPING)
    const user = userEvent.setup()

    render(<VolunteeringListingHeader />)

    await user.press(screen.getByText('listing.subline'))

    const modal = screen.getByTestId('volunteering-partner-modal')
    expect(within(modal).getAllByRole('heading')).toHaveLength(expectedPartners.length)

    await user.press(screen.getByText('global.gotIt'))

    expect(screen.queryByTestId('volunteering-partner-modal')).not.toBeOnTheScreen()

    jest.useRealTimers()
  })
})
