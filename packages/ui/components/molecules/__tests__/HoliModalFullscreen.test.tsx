import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React, { type ReactNode } from 'react'

import HoliModalFullscreen from '@holi/ui/components/molecules/HoliModalFullscreen'

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  return {
    ...RN,
    SafeAreaView: ({ children }: { children: ReactNode }) => <RN.View>{children}</RN.View>, // Replace SafeAreaView with a simple View for testing
  }
})

describe('HoliModalFullscreen.tsx', () => {
  it('renders correctly when open', () => {
    render(<HoliModalFullscreen label="Test" show={true} onDismiss={() => null} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when closed', () => {
    render(<HoliModalFullscreen label="Test" show={false} onDismiss={() => null} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('calls onDismiss prop when close button gets clicked', async () => {
    const mockFn = jest.fn()
    const { getByLabelText } = render(
      <HoliModalFullscreen label="test" show={true} onDismiss={mockFn} testID="testmodal" />
    )

    fireEvent.press(getByLabelText('modal.close'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('renders children', () => {
    const text = 'Fullscreen modal content'
    const { getByText } = render(
      <HoliModalFullscreen label="test" show={true} onDismiss={() => null} testID="testmodal">
        <Text size="md">{text}</Text>
      </HoliModalFullscreen>
    )

    expect(getByText(text)).toBeDefined()
  })
})
