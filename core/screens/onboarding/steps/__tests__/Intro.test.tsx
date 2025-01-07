import { Intro } from '@holi/core/screens/onboarding/steps/Intro'
import { TrackingEvent } from '@holi/core/tracking/events'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { render, screen, userEvent, within } from '@testing-library/react-native'
import React from 'react'

const mockUseTracking = useTracking as jest.Mock
jest.mock('@holi/core/tracking/hooks/useTracking', () => jest.fn())

jest.useFakeTimers()

describe('Intro', () => {
  beforeEach(() => {
    mockUseTracking.mockReturnValue({ track: jest.fn() })
  })

  it('should display texts, buttons and links', () => {
    render(<Intro onContinue={jest.fn()} />)

    expect(screen.getByText('onboarding.welcome.title')).toBeOnTheScreen()
    expect(screen.getByText('onboarding.welcome.text')).toBeOnTheScreen()

    // Continue button
    expect(screen.getByRole('button')).toBeOnTheScreen()

    // Login and three documents
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('should navigate to login page when pressing login link', async () => {
    const user = userEvent.setup()

    render(<Intro onContinue={jest.fn()} />)

    await user.press(within(screen.getByTestId('already-have-account-text')).getByRole('link'))

    expect(mockNavigate).toHaveBeenCalledWith('//login')
  })

  it('should track pressing the login button', async () => {
    const track = jest.fn()
    const user = userEvent.setup()
    mockUseTracking.mockReturnValue({ track })

    render(<Intro onContinue={jest.fn()} />)

    await user.press(within(screen.getByTestId('already-have-account-text')).getByRole('link'))

    expect(track).toHaveBeenCalledWith(TrackingEvent.Auth.LoginButtonPressed)
  })

  it('should call onContinue callback when pressing continue button', async () => {
    const onContinue = jest.fn()
    const user = userEvent.setup()

    render(<Intro onContinue={onContinue} />)

    await user.press(screen.getByRole('button'))

    expect(onContinue).toHaveBeenCalled()
  })
})
