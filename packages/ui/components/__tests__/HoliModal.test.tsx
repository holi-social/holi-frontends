import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliModal from '@holi/ui/components/HoliModal'

describe('renders correctly', () => {
  it('renders correctly when open', () => {
    const tree = renderer.create(<HoliModal show={true} onDismiss={() => null}></HoliModal>).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when closed', () => {
    const tree = renderer.create(<HoliModal show={false} onDismiss={() => null}></HoliModal>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('calls onDismiss prop function correctly', () => {
  it('calls onDismiss prop when clicked on backDrop if modal is open', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliModal show={true} onDismiss={mockFn} />)

    fireEvent.press(getByTestId('backDrop'))
    expect(mockFn).toBeCalledTimes(1)
  })
})
