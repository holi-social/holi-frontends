import type React from 'react'
import { act, userEvent, render, screen, waitFor } from '@testing-library/react-native'

import { Text } from 'holi-bricks/components/text'
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
  StackTracked,
} from '@holi/core/components/Trackable'

jest.mock('@holi/core/tracking/hooks/useTracking')

export const testTrackingEvent = {
  name: 'testTrackingEvent',
  event_version__major: 1,
  event_version__minor: 0,
  event_version__patch: 0,
}

describe('Trackable', () => {
  interface TestCase {
    name: string
    renderComponent: (props: TrackableProps<TrackableBaseProps>) => React.JSX.Element
    handlesEventPropagation?: boolean
    disabledWhileLoading?: boolean
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
      disabledWhileLoading: true,
    },
    {
      name: 'HoliLinkTracked',
      renderComponent: (props) => (
        <HoliLinkTracked label="test" href="/" {...props}>
          <Text>click me</Text>
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
      disabledWhileLoading: true,
    },
    {
      name: 'ChipActionTracked',
      renderComponent: (props) => <ChipActionTracked {...props}>click me</ChipActionTracked>,
    },
    {
      name: 'StackTracked',
      renderComponent: (props) => (
        <StackTracked {...props}>
          <Text>click me</Text>
        </StackTracked>
      ),
    },
  ]

  it.each(testCases)('$name should render child component', ({ renderComponent }) => {
    render(renderComponent({ trackingEvent: testTrackingEvent }))

    expect(screen.getByText('click me')).toBeDefined()
  })

  it.each(testCases)('$name should call onPress handler', async ({ renderComponent, handlesEventPropagation }) => {
    const user = userEvent.setup()
    const onPress = jest.fn()
    render(renderComponent({ trackingEvent: testTrackingEvent, onPress }))

    await user.press(screen.getByText('click me'))

    expect(onPress).toHaveBeenCalled()

    if (handlesEventPropagation) {
      expect(mockNavigate).toHaveBeenCalled()
    }
  })

  it.each(testCases.filter(({ handlesEventPropagation }) => !!handlesEventPropagation))(
    '$name should forward onPress result to prevent event propagation',
    async ({ renderComponent }) => {
      const user = userEvent.setup()

      const onPress = jest.fn(() => false)
      render(renderComponent({ trackingEvent: testTrackingEvent, onPress }))

      await user.press(screen.getByText('click me'))

      expect(onPress).toHaveBeenCalled()

      expect(mockNavigate).not.toHaveBeenCalled()
    }
  )

  it.each(testCases.filter(({ disabledWhileLoading }) => !!disabledWhileLoading))(
    '$name should forward onPress result to handle loading state',
    async ({ renderComponent }) => {
      const user = userEvent.setup()
      const { promise, resolve } = Promise.withResolvers<number>()
      const onPress = jest.fn(() => promise)

      render(renderComponent({ trackingEvent: testTrackingEvent, onPress }))

      await user.press(screen.getByText('click me'))

      await waitFor(() => expect(screen.root).toBeDisabled())

      expect(onPress).toHaveBeenCalled()

      // Resolve the promise i.e. the work the button is doing (button is disabled whilst 'work' is happening)
      // and the button should flip back not being disabled anymore
      await act(async () => {
        resolve(0)
      })

      expect(screen.root).not.toBeDisabled()
    }
  )

  it.each(testCases)('$name should track press event', async ({ renderComponent }) => {
    const user = userEvent.setup()

    render(renderComponent({ trackingEvent: testTrackingEvent }))

    await user.press(screen.getByText('click me'))
    expect(global.mockTrack).toHaveBeenCalledWith(testTrackingEvent)
  })
})
