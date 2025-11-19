import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'
import { renderRouter } from 'expo-router/testing-library'
import DonationCarousel from '@holi-apps/donations/components/DonationCarousel'
import { usePaginatedDonations } from '@holi-apps/donations/hooks/usePaginatedDonations'
import { createLocalizedDonations } from '@holi-apps/donations/components/__tests__/testData'
import { logError } from '@holi/core/errors/helpers'
import { Text } from 'react-native'

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

    renderRouter({ index: () => <DonationCarousel cardWidth={100} /> })

    expect(screen.queryByText('donations.app.name')).not.toBeOnTheScreen()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('should render projects', () => {
    renderRouter({ index: () => <DonationCarousel cardWidth={100} /> })

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
    renderRouter({ index: () => <DonationCarousel cardWidth={100} /> })

    expect(mockUsePaginatedDonations).toHaveBeenCalledWith({
      pageSize: 5,
      onError: expect.any(Function),
    })
  })

  it('should log error if fetch projects failed', () => {
    const testError = new Error('Test')

    renderRouter({ index: () => <DonationCarousel cardWidth={100} /> })

    // Simulate error
    mockUsePaginatedDonations.mock.calls[0][0].onError?.(testError)

    expect(mockLogError).toHaveBeenCalledWith(testError, 'Failed to load donation projects', {
      location: 'DonationCarousel.usePaginatedDonations',
    })
  })

  it('click on header should navigate to donations home screen', () => {
    const context = renderRouter({
      index: () => <DonationCarousel cardWidth={100} />,
      donations: () => <Text>Donations</Text>,
    })

    fireEvent.press(screen.getByText('donations.app.name'))

    expect(context).toHavePathname('/donations')
  })

  it('click on see more card should navigate to donations home screen', () => {
    const context = renderRouter({
      index: () => <DonationCarousel cardWidth={100} />,
      donations: () => <Text>Donations</Text>,
    })

    fireEvent.press(screen.getByTestId('donations-reco-slider-load-more-button'))
    expect(context).toHavePathname('/donations')
  })
})
