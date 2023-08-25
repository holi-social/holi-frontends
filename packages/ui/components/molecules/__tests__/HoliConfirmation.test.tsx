import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

describe('renders correctly', () => {
  it('renders correctly when open', () => {
    render(
      <HoliConfirmation
        label="Test"
        title="Test Title"
        description="Test Description"
        show={true}
        onDismiss={() => null}
        onConfirm={() => null}
      />
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('renders correctly when open and confirmationButtonType is danger', () => {
    render(
      <HoliConfirmation
        label="Test"
        title="Test Title"
        description="Test Description"
        confirmationButtonType="danger"
        show={true}
        onDismiss={() => null}
        onConfirm={() => null}
      />
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('renders correctly when closed', () => {
    render(
      <HoliConfirmation
        label="Test"
        title="Test Title"
        description="Test Description"
        show={false}
        onDismiss={() => null}
        onConfirm={() => null}
      />
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })
})

describe('calls onConfirm prop function correctly', () => {
  it('calls onConfirm prop when clicked on confirmation button if dialog is open', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliConfirmation
        label="Test"
        title="Test Title"
        description="Test Description"
        show={true}
        onDismiss={() => null}
        onConfirm={mockFn}
        testID="test"
      />
    )

    fireEvent.press(getByTestId('test-confirmation-confirm'))
    expect(mockFn).toBeCalledTimes(1)
  })
})
