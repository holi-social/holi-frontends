import { jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { mock } from 'jest-mock-extended'
import React from 'react'

import { HoliButtonTracked } from '@holi/core/components/HoliButtonTracked'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingHook } from '@holi/core/tracking/types'
import HoliText from '@holi/ui/components/atoms/HoliText'

const testTrackingEvent = {
  name: 'testTrackingEvent',
}

jest.mock('@holi/core/tracking/hooks/useTracking')
const useTrackingMock = useTracking as jest.Mock

describe('HoliButtonTracked', () => {
  it('renders child component', () => {
    const mockTrackingHook = mock<TrackingHook>()
    useTrackingMock.mockReturnValue(mockTrackingHook)
    render(
      <HoliButtonTracked label={'testButton'} trackingEvent={testTrackingEvent}>
        <HoliText>inner</HoliText>
      </HoliButtonTracked>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    const mockTrackingHook = mock<TrackingHook>()
    useTrackingMock.mockReturnValue(mockTrackingHook)
    render(<HoliButtonTracked label="click-me" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByLabelText('click-me'))

    expect(onPress).toHaveBeenCalled()
  })

  it('tracks button press', async () => {
    const onPress = jest.fn()
    const mockTrackingHook = mock<TrackingHook>()
    useTrackingMock.mockReturnValue(mockTrackingHook)

    render(<HoliButtonTracked label="click-me" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByLabelText('click-me'))

    expect(onPress).toHaveBeenCalled()
    expect(mockTrackingHook.track).toHaveBeenCalledWith(testTrackingEvent)
  })
})
