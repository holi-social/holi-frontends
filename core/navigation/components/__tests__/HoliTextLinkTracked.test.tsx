import { jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { HoliTextLinkTracked } from '@holi/core/navigation/components/HoliTextLinkTracked'
import HoliText from '@holi/ui/components/atoms/HoliText'

const testTrackingEvent = {
  name: 'testTrackingEvent',
  event_version__major: 1,
  event_version__minor: 0,
  event_version__patch: 0,
}

jest.mock('@holi/core/tracking/hooks/useTracking')

describe('HoliTextLinkTracked', () => {
  it('renders child component', () => {
    render(
      <HoliTextLinkTracked label="test" href="/" trackingEvent={testTrackingEvent}>
        <HoliText>inner</HoliText>
      </HoliTextLinkTracked>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    render(<HoliTextLinkTracked label="test" href="/" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByTestId('text-link'))

    expect(onPress).toHaveBeenCalled()
  })

  it('tracks call', async () => {
    const onPress = jest.fn()

    render(<HoliTextLinkTracked label="test" href="/" onPress={onPress} trackingEvent={testTrackingEvent} />)

    fireEvent.press(screen.getByTestId('text-link'))

    expect(onPress).toHaveBeenCalled()
    expect(global.mockTrack).toHaveBeenCalledWith(testTrackingEvent)
  })
})
