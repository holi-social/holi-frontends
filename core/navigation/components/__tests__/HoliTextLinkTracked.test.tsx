import { jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { mock } from 'jest-mock-extended'
import React from 'react'

import { withSilencedConsoleError } from '@holi/core/helpers/__tests__/helpers'
import { HoliTextLinkTracked } from '@holi/core/navigation/components/HoliTextLinkTracked'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingHook } from '@holi/core/tracking/types'
import HoliText from '@holi/ui/components/atoms/HoliText'

const testTrackingEvent = new (class extends TrackingEvent {
  name = 'testTrackingEvent'
  screen = 'testTrackingScreen'
})()

jest.mock('@holi/core/tracking/hooks/useTracking')
const useTrackingMock = useTracking as jest.Mock

describe('HoliTextLinkTracked', () => {
  it('renders child component', () => {
    const mockTrackingHook = mock<TrackingHook>()
    useTrackingMock.mockReturnValue(mockTrackingHook)
    render(
      <HoliTextLinkTracked label="test" href="/" trackingEvent={testTrackingEvent}>
        <HoliText>inner</HoliText>
      </HoliTextLinkTracked>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    const mockTrackingHook = mock<TrackingHook>()
    useTrackingMock.mockReturnValue(mockTrackingHook)
    render(<HoliTextLinkTracked label="test" href="/" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByTestId('text-link'))

    expect(onPress).toHaveBeenCalled()
  })

  it('tracks call', async () => {
    const onPress = jest.fn()
    const mockTrackingHook = mock<TrackingHook>()
    useTrackingMock.mockReturnValue(mockTrackingHook)

    render(<HoliTextLinkTracked label="test" href="/" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByTestId('text-link'))

    expect(onPress).toHaveBeenCalled()
    expect(mockTrackingHook.track).toHaveBeenCalledWith(testTrackingEvent)
  })

  it('calls onPress even if onTrack hook call throws an exception', async () => {
    withSilencedConsoleError(() => {
      const onPress = jest.fn()
      const mockTrackingHook = mock<TrackingHook>()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockTrackingHook.track.mockImplementation((event: TrackingEvent) => {
        throw new Error('intended error in test')
      })
      useTrackingMock.mockReturnValue(mockTrackingHook)

      render(<HoliTextLinkTracked label="test" href="/" onPress={onPress} trackingEvent={testTrackingEvent} />)

      fireEvent.press(screen.getByTestId('text-link'))

      expect(onPress).toHaveBeenCalled()
    })
  })
})
