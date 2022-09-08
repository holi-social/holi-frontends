import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliModal from '@holi/ui/components/molecules/HoliModal'

describe('renders correctly', () => {
  it('renders correctly when open', () => {
    const tree = renderer.create(<HoliModal label="Test" show={true} onDismiss={() => null} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when closed', () => {
    const tree = renderer.create(<HoliModal label="Test" show={false} onDismiss={() => null} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('calls onDismiss prop function correctly', () => {
  it('calls onDismiss prop when clicked on backdrop if modal is open', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliModal show={true} onDismiss={mockFn} testID="testmodal" />)

    fireEvent.press(getByTestId('testmodal-backdrop'))
    expect(mockFn).toBeCalledTimes(1)
  })
})
