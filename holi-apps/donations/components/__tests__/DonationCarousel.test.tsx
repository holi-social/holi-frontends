import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import DonationCarousel from '@holi-apps/donations/components/DonationCarousel'
import { usePaginatedDonations } from '@holi-apps/donations/hooks/usePaginatedDonations'
import { createLocalizedDonations } from '@holi-apps/donations/components/__tests__/testData'
import { logError } from '@holi/core/errors/helpers'

const mockUsePaginatedDonations = jest.mocked(usePaginatedDonations)
jest.mock('@holi-apps/donations/hooks/usePaginatedDonations', () => ({
  usePaginatedDonations: jest.fn(),
}))

const mockLogError = jest.mocked(logError)
jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

describe('DonationCarousel', () => {
  beforeEach(() => {
    mockUsePaginatedDonations.mockReturnValue({
      projects: createLocalizedDonations(5, 'en'),
      isLoading: false,
      canFetchMore: true,
      fetchNextPage: jest.fn(),
      totalResults: 123,
      isFetchingMore: false,
    })
  })
  it('should render nothing while loading', () => {
    mockUsePaginatedDonations.mockReturnValue({
      projects: [],
      isLoading: true,
      canFetchMore: false,
      fetchNextPage: jest.fn(),
      totalResults: 0,
      isFetchingMore: false,
    })

    render(<DonationCarousel cardWidth={100} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should render projects', () => {
    render(<DonationCarousel cardWidth={100} />)

    // Header
    expect(screen.getByText('donations.app.name')).toBeOnTheScreen()
    expect(screen.getByText('donations.app.subline'))

    // 5 Results + see more card
    expect(screen.getAllByRole('link')).toHaveLength(5 + 1)
    expect(screen.getByText('English Title 0')).toBeOnTheScreen()
    expect(screen.getByText('English Title 1')).toBeOnTheScreen()
    expect(screen.getByText('English Title 2')).toBeOnTheScreen()
    expect(screen.getByText('English Title 3')).toBeOnTheScreen()
    expect(screen.getByText('English Title 4')).toBeOnTheScreen()
  })

  it('should fetch projects with correct paramters', () => {
    render(<DonationCarousel cardWidth={100} />)

    expect(mockUsePaginatedDonations).toHaveBeenCalledWith({
      pageSize: 5,
      onError: expect.any(Function),
    })
  })

  it('should log error if fetch projects failed', () => {
    const testError = new Error('Test')

    render(<DonationCarousel cardWidth={100} />)

    // Simulate error
    mockUsePaginatedDonations.mock.calls[0][0].onError?.(testError)

    expect(mockLogError).toHaveBeenCalledWith(testError, 'Failed to load donation projects', {
      location: 'DonationCarousel.usePaginatedDonations',
    })
  })

  it('click on header should navigate to donations home screen', async () => {
    const user = userEvent.setup()

    render(<DonationCarousel cardWidth={100} />)

    await user.press(screen.getByText('donations.app.name'))

    expect(mockNavigate).toHaveBeenCalledWith('/donations')
  })

  it('click on see more card should navigate to donations home screen', async () => {
    const user = userEvent.setup()

    render(<DonationCarousel cardWidth={100} />)

    await user.press(await screen.getByLabelText('donations.donationListing.loadMoreButton.text'))

    expect(mockNavigate).toHaveBeenCalledWith('/donations')
  })
})
