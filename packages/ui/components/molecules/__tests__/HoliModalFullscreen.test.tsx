import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'

import { Text } from 'holi-bricks/components/text/Text'
import HoliModalFullscreen from '@holi/ui/components/molecules/HoliModalFullscreen'

describe('HoliModalFullscreen.tsx', () => {
  it('renders correctly when open', () => {
    render(<HoliModalFullscreen label="Test" shown={true} onDismiss={() => null} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when closed', () => {
    render(<HoliModalFullscreen label="Test" shown={false} onDismiss={() => null} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('calls onDismiss prop when close button gets clicked', async () => {
    const mockFn = jest.fn()
    const { getByLabelText } = render(
      <HoliModalFullscreen label="test" shown={true} onDismiss={mockFn} testID="testmodal" />
    )

    fireEvent.press(getByLabelText('modal.close'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('renders children', () => {
    const text = 'Fullscreen modal content'
    const { getByText } = render(
      <HoliModalFullscreen label="test" shown={true} onDismiss={() => null} testID="testmodal">
        <Text>{text}</Text>
      </HoliModalFullscreen>
    )

    expect(getByText(text)).toBeDefined()
  })
})
