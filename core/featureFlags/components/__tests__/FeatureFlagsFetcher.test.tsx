import { render } from '@testing-library/react-native'
import React from 'react'
import { AppState } from 'react-native'

import FeatureFlagsFetcher from '@holi/core/featureFlags/components/FeatureFlagsFetcher'
import { useLoginState } from '@holi/core/auth/loginState'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useFeatureFlagRefetch } from '@holi/core/featureFlags/hooks/useFeatureFlagRefetch'

const mockUseFeatureFlagRefetch = jest.mocked(useFeatureFlagRefetch)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlagRefetch', () => ({
  useFeatureFlagRefetch: jest.fn(),
}))

const mockOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseLoginState = jest.mocked(useLoginState)
jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
}))

const mockAddEventListener = jest.fn()
const mockedRefetch = jest.fn()

describe('FeatureFlagsFetcher', () => {
  beforeEach(() => {
    mockedRefetch.mockResolvedValue(undefined)
    mockUseFeatureFlagRefetch.mockReturnValue(mockedRefetch)
    mockUseLoginState.mockReturnValue({
      isLoggedIn: false,
      isUnknown: false,
      isLoggedOut: true,
    })
    mockAddEventListener.mockReturnValue({ remove: jest.fn() })
    jest.spyOn(AppState, 'addEventListener').mockImplementation(mockAddEventListener)
  })

  it('should refetch feature flags when changing to active app state', () => {
    render(<FeatureFlagsFetcher />)

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    const handleAppStateChange = mockAddEventListener.mock.calls[0][1]
    handleAppStateChange('active')

    expect(mockedRefetch).toHaveBeenCalled()
  })

  it('should not refetch feature flags when app state changed but is not active', () => {
    render(<FeatureFlagsFetcher />)

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    mockedRefetch.mockClear()

    const handleAppStateChange = mockAddEventListener.mock.calls[0][1]
    handleAppStateChange('inactive')

    expect(mockedRefetch).not.toHaveBeenCalled()
  })

  it('should register to refetch feature flags on refresh', () => {
    render(<FeatureFlagsFetcher />)

    expect(mockOnRefresh).toHaveBeenCalledWith(mockedRefetch)
  })

  it('should refetch feature flags on login state changes', () => {
    const { rerender } = render(<FeatureFlagsFetcher />)

    expect(mockedRefetch).toHaveBeenCalledTimes(1)

    mockUseLoginState.mockReturnValue({
      isLoggedIn: true,
      isUnknown: false,
      isLoggedOut: false,
      userId: '123',
    })
    rerender(<FeatureFlagsFetcher />)

    expect(mockedRefetch).toHaveBeenCalledTimes(2)
  })
})
