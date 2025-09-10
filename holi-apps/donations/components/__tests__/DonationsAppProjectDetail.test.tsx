import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import DonationsAppProjectDetail from '@holi-apps/donations/screens/DonationsAppProjectDetail'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { typesenseDonation } from '@holi-apps/donations/components/__tests__/testData'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { On, useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { useErrorHandling } from '@holi/core/errors/hooks'

jest.mock('@holi/core/navigation/hooks/useParam')

const mockUseFeatureFlagWithMaintenance = jest.mocked(useFeatureFlagWithMaintenance)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance', () => {
  const original = jest.requireActual('@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance')
  return {
    ...original,
    useFeatureFlagWithMaintenance: jest.fn(),
  }
})

const mockUseSingleTypesenseDocumentQuery = jest.mocked(useSingleTypesenseDocumentQuery)
jest.mock('@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery', () => ({
  useSingleTypesenseDocumentQuery: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

describe('DonationsAppProjectDetail', () => {
  beforeEach(() => {
    mockUseFeatureFlagWithMaintenance.mockReturnValue(On)
    mockUseErrorHandling.mockReturnValue({ displayError: jest.fn() })
    mockParameters({ projectId: '123' })
    mockUseSingleTypesenseDocumentQuery.mockReturnValue({
      isLoading: false,
      refresh: jest.fn(),
      document: typesenseDonation,
    })
  })

  it('should render loader while loading', () => {
    mockUseSingleTypesenseDocumentQuery.mockReturnValue({
      isLoading: true,
      refresh: jest.fn(),
      document: undefined,
    })

    render(<DonationsAppProjectDetail />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should register refresh function', () => {
    const refresh = jest.fn()
    mockUseSingleTypesenseDocumentQuery.mockReturnValue({
      isLoading: true,
      refresh,
      document: undefined,
    })

    render(<DonationsAppProjectDetail />)

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refresh)
  })

  it('should render project texts', () => {
    render(<DonationsAppProjectDetail />)

    expect(screen.getByText('English Title')).toBeOnTheScreen()
    expect(screen.getByText('Berlin, Germany')).toBeOnTheScreen()
    expect(screen.getByText('“English Summary”')).toBeOnTheScreen()
    expect(screen.getByText('English Description')).toBeOnTheScreen()
  })

  it('should navigate to external url with UTM query parameters on donate button click', async () => {
    const user = userEvent.setup()
    render(<DonationsAppProjectDetail />)

    await user.press(screen.getByTestId('donations-project-detail-donate-btn'))

    expect(mockOpenURL).toHaveBeenCalledWith(
      'https://example.com/donation/123?utm_source=holi&utm_medium=detailpage&utm_campaign=holi'
    )
  })

  it('should display error when fetching project failed', () => {
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    const testError = new Error('Test')
    render(<DonationsAppProjectDetail />)

    // Simulate error
    mockUseSingleTypesenseDocumentQuery.mock.calls[0][2]?.onError?.(testError)

    expect(displayError).toHaveBeenCalledWith(testError, 'Failed to load donation project', {
      location: 'DonationsAppProjectDetail.useSingleTypesenseDocumentQuery',
      projectId: '123',
    })
  })

  it('should navigate to not found page if project was not found', () => {
    render(<DonationsAppProjectDetail />)

    // Simulate not found error
    mockUseSingleTypesenseDocumentQuery.mock.calls[0][2]?.onNotFound?.()

    expect(mockNavigate).toHaveBeenCalledWith('/404')
  })
})
