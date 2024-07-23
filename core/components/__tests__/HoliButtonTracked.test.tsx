import { jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { HoliButtonTracked } from '@holi/core/components/HoliButtonTracked'
import HoliText from '@holi/ui/components/atoms/HoliText'

const testTrackingEvent = {
  name: 'testTrackingEvent',
  event_version__major: 1,
  event_version__minor: 0,
  event_version__patch: 0,
}

describe('HoliButtonTracked', () => {
  it('renders child component', () => {
    render(
      <HoliButtonTracked label={'testButton'} trackingEvent={testTrackingEvent}>
        <HoliText>inner</HoliText>
      </HoliButtonTracked>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    render(<HoliButtonTracked label="click-me" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByLabelText('click-me'))

    expect(onPress).toHaveBeenCalled()
  })

  it('tracks button press', async () => {
    const onPress = jest.fn()

    render(<HoliButtonTracked label="click-me" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByLabelText('click-me'))

    expect(onPress).toHaveBeenCalled()
    expect(global.mockTrack).toHaveBeenCalledWith(testTrackingEvent)
  })
})
