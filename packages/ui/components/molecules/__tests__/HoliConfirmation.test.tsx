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
        confirmationButtonType="warning"
        onDismiss={() => undefined}
        onConfirm={() => undefined}
      />
    )

    expect(screen.getByText('Test Title')).toBeVisible()
    expect(screen.getByText('Test Description')).toBeVisible()
    expect(screen.getByText('confirmation.dismiss')).toBeVisible()
    expect(screen.getByText('confirmation.confirm')).toBeVisible()
  })

  it('renders red confirm button for confirmationButtonType warning', () => {
    render(
      <HoliConfirmation
        label="Test"
        title="Test Title"
        description="Test Description"
        confirmationButtonType="warning"
        show={true}
        onDismiss={() => undefined}
        onConfirm={() => undefined}
      />
    )

    expect(screen.getByTestId('holi-confirmation-confirm')).toHaveStyle({ backgroundColor: '#ffebec' })
  })

  it('does not render when closed', () => {
    render(
      <HoliConfirmation
        label="Test"
        title="Test Title"
        description="Test Description"
        show={false}
        onDismiss={() => undefined}
        onConfirm={() => undefined}
      />
    )

    expect(screen.toJSON()).toBeNull()
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
        onDismiss={() => undefined}
        onConfirm={mockFn}
        testID="test"
      />
    )

    fireEvent.press(getByTestId('test-confirmation-confirm'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
