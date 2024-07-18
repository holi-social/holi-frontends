import { jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { HoliLinkTracked } from '@holi/core/navigation/components/HoliLinkTracked'
import HoliText from '@holi/ui/components/atoms/HoliText'

const testTrackingEvent = {
  name: 'testTrackingEvent',
  event_version__major: 1,
  event_version__minor: 0,
  event_version__patch: 0,
}

describe('HoliLinkTracked', () => {
  it('renders child component', () => {
    render(
      <HoliLinkTracked label="test" href="/" trackingEvent={testTrackingEvent}>
        <HoliText>inner</HoliText>
      </HoliLinkTracked>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()

    render(<HoliLinkTracked label="test" href="/" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByLabelText('test'))

    expect(onPress).toHaveBeenCalled()
  })

  it('tracks call', async () => {
    const onPress = jest.fn()

    render(<HoliLinkTracked label="test" href="/" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByLabelText('test'))

    expect(onPress).toHaveBeenCalled()
    expect(global.mockTrack).toHaveBeenCalledWith(testTrackingEvent)
  })
})
