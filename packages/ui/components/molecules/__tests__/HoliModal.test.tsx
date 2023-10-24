import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import HoliModal from '@holi/ui/components/molecules/HoliModal'

describe('HoliModal', () => {
  it('renders correctly when open', () => {
    const { toJSON } = render(<HoliModal label="Test" testID="test-modal" show={true} onDismiss={() => null} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly when closed', () => {
    const { toJSON } = render(<HoliModal label="Test" testID="test-modal" show={false} onDismiss={() => null} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('calls onDismiss prop when clicked on backdrop if modal is open', async () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliModal label="test" show={true} onDismiss={mockFn} testID="testmodal" />)

    fireEvent.press(getByTestId('testmodal-backdrop'))

    expect(mockFn).toBeCalledTimes(1)
  })
})
