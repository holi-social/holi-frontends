import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text'
import type React from 'react'

import {
  ButtonTracked,
  HoliButtonLoadingTracked,
  HoliButtonTracked,
  HoliLinkTracked,
  HoliTextLinkTracked,
  TextLinkTracked,
  type TrackableBaseProps,
  type TrackableProps,
  ChipActionTracked,
} from '@holi/core/components/Trackable'

export const testTrackingEvent = {
  name: 'testTrackingEvent',
  event_version__major: 1,
  event_version__minor: 0,
  event_version__patch: 0,
}

jest.mock('@holi/core/tracking/hooks/useTracking')

describe('Trackable', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })
  interface TestCase {
    name: string
    renderComponent: (props: TrackableProps<TrackableBaseProps>) => React.JSX.Element
    handlesEventPropagation?: boolean
    handlesLoadingState?: boolean
  }
  const testCases: TestCase[] = [
    {
      name: 'HoliButtonTracked',
      renderComponent: (props) => (
        <HoliButtonTracked label="test" {...props}>
          click me
        </HoliButtonTracked>
      ),
    },
    {
      name: 'HoliButtonLoadingTracked',
      renderComponent: (props) => <HoliButtonLoadingTracked label="click me" {...props} />,
      handlesLoadingState: true,
    },
    {
      name: 'HoliLinkTracked',
      renderComponent: (props) => (
        <HoliLinkTracked label="test" href="/" {...props}>
          <Text size="md">click me</Text>
        </HoliLinkTracked>
      ),
      handlesEventPropagation: true,
    },
    {
      name: 'HoliTextLinkTracked',
      renderComponent: (props) => (
        <HoliTextLinkTracked label="test" href="/" size="md" {...props}>
          click me
        </HoliTextLinkTracked>
      ),
      handlesEventPropagation: true,
    },
    {
      name: 'TextLinkTracked',
      renderComponent: (props) => (
        <TextLinkTracked size="md" {...props}>
          click me
        </TextLinkTracked>
      ),
    },
    {
      name: 'ButtonTracked',
      renderComponent: (props) => <ButtonTracked label="click me" {...props} />,
      handlesLoadingState: true,
    },
    {
      name: 'ChipActionTracked',
      renderComponent: (props) => <ChipActionTracked {...props}>click me</ChipActionTracked>,
    },
  ]

  it.each(testCases)('$name should render child component', ({ renderComponent }) => {
    render(renderComponent({ trackingEvent: testTrackingEvent }))

    expect(screen.getByText('click me')).toBeDefined()
  })

  it.each(testCases)('$name should call onPress handler', async ({ renderComponent, handlesEventPropagation }) => {
    const onPress = jest.fn()
    render(renderComponent({ trackingEvent: testTrackingEvent, onPress }))

    await act(async () => {
      fireEvent.press(screen.getByText('click me'))

      await jest.runAllTimersAsync()
    })

    expect(onPress).toHaveBeenCalled()

    if (handlesEventPropagation) {
      expect(mockNavigate).toHaveBeenCalled()
    }
  })

  it.each(testCases.filter(({ handlesEventPropagation }) => !!handlesEventPropagation))(
    '$name should forward onPress result to prevent event propagation',
    async ({ renderComponent }) => {
      const onPress = jest.fn(() => false)
      render(renderComponent({ trackingEvent: testTrackingEvent, onPress }))

      await act(async () => {
        fireEvent.press(screen.getByText('click me'))

        await jest.runAllTimersAsync()
      })

      expect(onPress).toHaveBeenCalled()

      expect(mockNavigate).not.toHaveBeenCalled()
    }
  )

  it.each(testCases.filter(({ handlesLoadingState }) => !!handlesLoadingState))(
    '$name should forward onPress result to handle loading state',
    async ({ renderComponent }) => {
      const onPress = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)))
      render(renderComponent({ trackingEvent: testTrackingEvent, onPress }))

      await act(async () => {
        fireEvent.press(screen.getByText('click me'))

        await waitFor(() => expect(screen.root).toBeDisabled())

        await jest.runAllTimersAsync()
      })

      expect(onPress).toHaveBeenCalled()

      expect(screen.root).not.toBeDisabled()
    }
  )

  it.each(testCases)('$name should track press event', async ({ renderComponent }) => {
    render(renderComponent({ trackingEvent: testTrackingEvent }))

    await act(async () => {
      fireEvent.press(screen.getByText('click me'))

      await jest.runAllTimersAsync()
    })

    expect(global.mockTrack).toHaveBeenCalledWith(testTrackingEvent)
  })
})
