import { render } from '@testing-library/react-native'
import React from 'react'
import { AppState } from 'react-native'

import FeatureFlagsFetcher from '@holi/core/featureFlags/components/FeatureFlagsFetcher'

const mockRefetch = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlagRefetch', () => ({
  useFeatureFlagRefetch: () => mockRefetch,
}))

const mockAddEventListener = jest.fn()

describe('FeatureFlagsFetcher', () => {
  beforeEach(() => {
    mockRefetch.mockResolvedValue(undefined)
    mockAddEventListener.mockReturnValue({ remove: jest.fn() })
    jest.spyOn(AppState, 'addEventListener').mockImplementation(mockAddEventListener)
  })

  it('should refetch feature flags when changing to active app state', () => {
    render(<FeatureFlagsFetcher />)

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    const handleAppStateChange = mockAddEventListener.mock.calls[0][1]
    handleAppStateChange('active')

    expect(mockRefetch).toHaveBeenCalled()
  })

  it('should not refetch feature flags when app state changed but is not active', () => {
    render(<FeatureFlagsFetcher />)

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    const handleAppStateChange = mockAddEventListener.mock.calls[0][1]
    handleAppStateChange('inactive')

    expect(mockRefetch).not.toHaveBeenCalled()
  })
})
