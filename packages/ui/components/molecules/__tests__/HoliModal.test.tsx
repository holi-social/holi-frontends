import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import HoliModal from '@holi/ui/components/molecules/HoliModal'

describe('HoliModal', () => {
  it('renders content when shown', () => {
    render(
      <HoliModal label="Test" testID="test-modal" show={true} onDismiss={() => null}>
        <Text>Content</Text>
      </HoliModal>
    )
    expect(screen.getByText('Content'))
  })

  it('is not rendered when not shown', async () => {
    render(
      <HoliModal label="Test" testID="test-modal" show={false} onDismiss={() => null}>
        <Text>Content</Text>
      </HoliModal>
    )
    expect(screen.toJSON()).toBeNull()
  })

  it('calls onDismiss prop when clicked on backdrop if modal is open', async () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliModal label="test" show={true} onDismiss={mockFn} testID="testmodal" />)

    fireEvent.press(getByTestId('testmodal-backdrop'))

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
