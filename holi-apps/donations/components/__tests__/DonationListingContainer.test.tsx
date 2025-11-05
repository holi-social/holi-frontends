import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { DonationListingContainer } from '@holi-apps/donations/components/DonationListingContainer'
import { usePaginatedDonations } from '@holi-apps/donations/hooks/usePaginatedDonations'
import { createLocalizedDonations } from '@holi-apps/donations/components/__tests__/testData'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

const mockUsePaginatedDonations = jest.mocked(usePaginatedDonations)
jest.mock('@holi-apps/donations/hooks/usePaginatedDonations', () => ({
  usePaginatedDonations: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const selectedLocation: GeolocationSuggestion = {
  id: '123',
  label: 'Hamburg, Germany',
  coordinates: {
    latitude: 12,
    longitude: 34,
  },
}

describe('DonationListingContainer', () => {
  beforeEach(() => {
    mockUsePaginatedDonations.mockReturnValue({
      isLoading: false,
      fetchNextPage: jest.fn(),
      canFetchMore: true,
      totalResults: 123,
      projects: createLocalizedDonations(10),
      isFetchingMore: false,
    })
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
  })

  it('should render project list', () => {
    render(<DonationListingContainer resetSearch={jest.fn()} />)

    expect(screen.getByText('donations.donationListing.heading')).toBeOnTheScreen()
  })

  it('should fetch paginated donations with correct parameters', () => {
    render(
      <DonationListingContainer selectedLocation={selectedLocation} loadingGeolocation={true} resetSearch={jest.fn()} />
    )

    expect(mockUsePaginatedDonations).toHaveBeenCalledWith({
      pageSize: 10,
      selectedLocation,
      loadingGeolocation: true,
      onError: expect.any(Function),
    })
  })

  it('should display error if fetching donations failed', () => {
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({
      displayError,
    })
    const testError = new Error('Test')
    render(
      <DonationListingContainer selectedLocation={selectedLocation} loadingGeolocation={true} resetSearch={jest.fn()} />
    )

    // Simulate error
    mockUsePaginatedDonations.mock.calls[0][0].onError?.(testError)

    expect(displayError).toHaveBeenCalledWith(testError, 'Failed to load donation projects', {
      displayMessage: 'donations.donationListing.error',
      location: 'DonationListingContainer.usePaginatedDonations',
      geolocation: '123',
    })
  })

  it('should render footer if more results can be fetched', () => {
    mockUsePaginatedDonations.mockReturnValue({
      isLoading: false,
      fetchNextPage: jest.fn(),
      canFetchMore: true,
      totalResults: 10,
      projects: createLocalizedDonations(10),
      isFetchingMore: false,
    })
    render(<DonationListingContainer resetSearch={jest.fn()} />)

    expect(screen.getByTestId('donations-loader')).toBeOnTheScreen()
  })

  it('should not render footer if fetching more results is not possible', () => {
    mockUsePaginatedDonations.mockReturnValue({
      isLoading: false,
      fetchNextPage: jest.fn(),
      canFetchMore: false,
      totalResults: 10,
      projects: createLocalizedDonations(10),
      isFetchingMore: false,
    })
    render(<DonationListingContainer resetSearch={jest.fn()} />)

    expect(screen.queryByTestId('donations-loader')).not.toBeOnTheScreen()
  })

  it('should pass on callback to reset search', async () => {
    mockUsePaginatedDonations.mockReturnValue({
      isLoading: false,
      fetchNextPage: jest.fn(),
      canFetchMore: true,
      totalResults: 0,
      projects: [],
      isFetchingMore: false,
    })
    const resetSearch = jest.fn()
    const user = userEvent.setup()
    render(<DonationListingContainer resetSearch={resetSearch} selectedLocation={selectedLocation} />)

    await user.press(screen.getByLabelText('search.filter.reset_one'))

    expect(resetSearch).toHaveBeenCalled()
  })
})
