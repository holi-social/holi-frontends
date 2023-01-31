import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'
import renderer from 'react-test-renderer'

import HoliModalFullscreen from '@holi/ui/components/molecules/HoliModalFullscreen'

describe('HoliModalFullscreen.tsx', () => {
  it('renders correctly when open', () => {
    const tree = renderer.create(<HoliModalFullscreen label="Test" show={true} onDismiss={() => null} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when closed', () => {
    const tree = renderer.create(<HoliModalFullscreen label="Test" show={false} onDismiss={() => null} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls onDismiss prop when close button gets clicked', () => {
    const mockFn = jest.fn()
    const { getByLabelText } = render(
      <HoliModalFullscreen label="test" show={true} onDismiss={mockFn} testID="testmodal" />
    )

    fireEvent.press(getByLabelText('modal.close'))
    expect(mockFn).toBeCalledTimes(1)
  })

  it('renders children', () => {
    const text = 'Fullscreen modal content'
    const { getByText } = render(
      <HoliModalFullscreen label="test" show={true} onDismiss={() => null} testID="testmodal">
        <Text>{text}</Text>
      </HoliModalFullscreen>
    )

    expect(getByText(text)).toBeDefined()
  })
})
