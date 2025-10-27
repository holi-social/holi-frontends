import { Intro } from '@holi/core/screens/onboarding/steps/Intro'
import { TrackingEvent } from '@holi/core/tracking/events'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { act, renderRouter, screen, fireEvent, within } from 'expo-router/testing-library'
import React from 'react'
import { Text } from 'react-native'

const mockUseTracking = useTracking as jest.Mock
jest.mock('@holi/core/tracking/hooks/useTracking', () => jest.fn())

describe('Intro', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseTracking.mockReturnValue({ track: jest.fn() })
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('should display texts, buttons and links', () => {
    renderRouter({ index: () => <Intro onContinue={jest.fn()} /> })

    expect(screen.getByText('onboarding.welcome.title')).toBeOnTheScreen()

    // Continue button
    expect(screen.getByRole('button')).toBeOnTheScreen()

    // Login and three documents
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('should navigate to login page when pressing login link', () => {
    const context = renderRouter({
      index: () => <Intro onContinue={jest.fn()} />,
      login: () => <Text>Login</Text>,
    })

    fireEvent.press(within(screen.getByTestId('already-have-account-text')).getByRole('link'))

    expect(context).toHavePathname('/login')
  })

  it('should track pressing the login button', () => {
    const track = jest.fn()
    mockUseTracking.mockReturnValue({ track })

    renderRouter({
      index: () => <Intro onContinue={jest.fn()} />,
      login: () => <Text>Login</Text>,
    })

    fireEvent.press(within(screen.getByTestId('already-have-account-text')).getByRole('link'))

    expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.LoginButtonPressed)
  })

  it('should call onContinue callback when pressing continue button', () => {
    const onContinue = jest.fn()

    renderRouter({ index: () => <Intro onContinue={onContinue} /> })

    fireEvent.press(screen.getByRole('button'))

    expect(onContinue).toHaveBeenCalled()
  })
})
