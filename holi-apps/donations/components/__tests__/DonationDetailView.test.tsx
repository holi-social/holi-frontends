import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { DonationDetailView } from '@holi-apps/donations/components/DonationDetailView'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useDonationDetails } from '@holi-apps/donations/hooks/useDonationDetails'
import { localizedTypesenseDonation } from '@holi-apps/donations/components/__tests__/testData'

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const mockUseDonationDetails = jest.mocked(useDonationDetails)
jest.mock('@holi-apps/donations/hooks/useDonationDetails', () => ({
  useDonationDetails: jest.fn(),
}))

describe('DonationDetailView', () => {
  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({ displayError: jest.fn() })
    mockUseDonationDetails.mockReturnValue({
      isLoading: false,
      project: localizedTypesenseDonation,
    })
  })

  it('should render loader while loading', () => {
    mockUseDonationDetails.mockReturnValue({
      isLoading: true,
      project: undefined,
    })

    render(<DonationDetailView projectId="123" />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should render project texts', () => {
    render(<DonationDetailView projectId="123" />)

    expect(screen.getByText('English Title 123')).toBeOnTheScreen()
    expect(screen.getByText('Berlin, Germany')).toBeOnTheScreen()
    expect(screen.getByText('“English Summary”')).toBeOnTheScreen()
    expect(screen.getByText('English Description')).toBeOnTheScreen()
  })

  it('should fetch details with correct id', () => {
    render(<DonationDetailView projectId="123" />)

    expect(mockUseDonationDetails).toHaveBeenCalledWith({
      projectId: '123',
      onError: expect.any(Function),
      onNotFound: expect.any(Function),
    })
  })

  it('should navigate to external url with UTM query parameters on donate button click', async () => {
    const user = userEvent.setup()
    render(<DonationDetailView projectId="123" />)

    await user.press(screen.getByTestId('donations-project-detail-donate-btn'))

    expect(mockOpenURL).toHaveBeenCalledWith(
      'https://example.com/donation/123?utm_source=holi&utm_medium=detailpage&utm_campaign=holi'
    )
  })

  it('should display error when fetching project failed', () => {
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    const testError = new Error('Test')
    render(<DonationDetailView projectId="123" />)

    // Simulate error
    mockUseDonationDetails.mock.calls[0][0].onError?.(testError)

    expect(displayError).toHaveBeenCalledWith(testError, 'Failed to load donation project', {
      location: 'DonationsAppProjectDetail.useSingleTypesenseDocumentQuery',
      projectId: '123',
    })
  })

  it('should navigate to not found page if project was not found', () => {
    render(<DonationDetailView projectId="123" />)

    // Simulate not found error
    mockUseDonationDetails.mock.calls[0][0].onNotFound?.()

    expect(mockNavigate).toHaveBeenCalledWith('/404')
  })
})
