import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { AuthError } from '@holi/core/auth/screens/AuthError'
import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { act, renderRouter, screen, userEvent } from 'expo-router/testing-library'
import React from 'react'

jest.mock('@holi/core/navigation/hooks/useParam')

jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
  logErrorLocal: jest.fn(),
}))

const mockNewKratosSdk = newKratosSdk as jest.Mock
jest.mock('@holi/core/auth/helpers/sdk', () => ({
  newKratosSdk: jest.fn(),
}))

jest.useFakeTimers()

describe('AuthError', () => {
  const mockGetFlowError = jest.fn()

  beforeEach(() => {
    mockParameters({ id: '123' })
    mockGetFlowError.mockResolvedValue({
      data: {
        error: 'some error',
      },
    })
    mockNewKratosSdk.mockReturnValue({
      getFlowError: mockGetFlowError,
    })
  })

  it('should fetch flow error by id', async () => {
    renderRouter({ index: () => <AuthError /> })

    expect(mockGetFlowError).toHaveBeenCalledWith({ id: '123' })

    await act(() => jest.runOnlyPendingTimersAsync())
  })

  it('should not fetch flow error if no id was given', () => {
    mockParameters({})

    renderRouter({ index: () => <AuthError /> })

    expect(mockGetFlowError).not.toHaveBeenCalled()
  })

  it('should display loader while fetching the flow error', async () => {
    renderRouter({ index: () => <AuthError /> })

    expect(screen.getByTestId('loader')).toBeOnTheScreen()

    await act(() => jest.runOnlyPendingTimersAsync())
  })

  it('should display a general error', async () => {
    renderRouter({ index: () => <AuthError /> })

    await act(() => jest.runOnlyPendingTimersAsync())

    expect(screen.getByText('auth.error.message')).toBeOnTheScreen()
  })

  it('should log the flow error locally', async () => {
    renderRouter({ index: () => <AuthError /> })

    await act(() => jest.runOnlyPendingTimersAsync())

    expect(logErrorLocal).toHaveBeenCalledWith('some error', 'Got login flow error', {
      location: 'AuthError.getFlowError',
    })
  })

  it('should log error if fetching the flow error failed', async () => {
    mockGetFlowError.mockRejectedValue('Test')

    renderRouter({ index: () => <AuthError /> })

    await act(() => jest.runOnlyPendingTimersAsync())

    expect(logError).toHaveBeenCalledWith('Test', 'Failed to fetch flow error', { location: 'AuthError.getFlowError' })
  })

  it('should display button to go back to login', async () => {
    const user = userEvent.setup()

    const context = renderRouter({ index: () => <AuthError /> })

    await act(() => jest.runOnlyPendingTimersAsync())

    await user.press(screen.getByText('auth.error.backToLogin'))

    expect(context).toHavePathname('/login')
  })
})
