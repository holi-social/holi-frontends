import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

jest.mock('@holi/core/tracking/hooks/useTracking', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('HoliConfirmation Component', () => {
  describe('Callback Functions', () => {
    it('calls onPrimary prop when clicked on confirmation button if dialog is open', () => {
      const mockPrimary = jest.fn()
      const mockSecondary = jest.fn()
      const mockDismiss = jest.fn()

      const { getByTestId } = render(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={true}
          onDismiss={mockDismiss}
          onSecondary={mockSecondary}
          onPrimary={mockPrimary}
          testID="test"
        />
      )

      fireEvent.press(getByTestId('test-confirmation-primary'))
      expect(mockPrimary).toHaveBeenCalledTimes(1)
    })

    it('calls onDismiss prop when clicked on X icon if dialog is open', () => {
      const mockPrimary = jest.fn()
      const mockSecondary = jest.fn()
      const mockDismiss = jest.fn()

      const { getByTestId } = render(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={true}
          onDismiss={mockDismiss}
          onSecondary={mockSecondary}
          onPrimary={mockPrimary}
          testID="test"
        />
      )

      fireEvent.press(getByTestId('test-confirmation-dismiss'))
      expect(mockDismiss).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel prop if present, when clicked on secondary button if dialog is open', () => {
      const mockPrimary = jest.fn()
      const mockDismiss = jest.fn()
      const mockSecondary = jest.fn()

      const { getByTestId } = render(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={true}
          onDismiss={mockDismiss}
          onSecondary={mockSecondary}
          onPrimary={mockPrimary}
          testID="test"
        />
      )

      fireEvent.press(getByTestId('test-confirmation-secondary'))
      expect(mockSecondary).toHaveBeenCalledTimes(1)
      expect(mockDismiss).toHaveBeenCalledTimes(0)
    })
  })

  describe('Rendering Behavior', () => {
    it('renders correctly when open', () => {
      render(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={true}
          primaryButtonVariant="danger"
          onDismiss={() => undefined}
          onPrimary={() => undefined}
        />
      )

      expect(screen.getByText('Test Title')).toBeVisible()
      expect(screen.getByText('Test Description')).toBeVisible()
      expect(screen.getByText('confirmation.dismiss')).toBeVisible()
      expect(screen.getByText('confirmation.confirm')).toBeVisible()
    })

    it('renders red confirm button for primaryButtonType danger', () => {
      render(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={true}
          primaryButtonVariant="danger"
          onDismiss={() => undefined}
          onPrimary={() => undefined}
          testID="test" // Ensure the testID is correctly passed
        />
      )

      expect(screen.getByTestId('test-confirmation-primary')).toHaveStyle({ backgroundColor: '#ffebec' })
    })

    it('does not render when closed', () => {
      const { toJSON } = render(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={false}
          onDismiss={() => undefined}
          onPrimary={() => undefined}
          testID="test"
        />
      )

      expect(toJSON()).toBeNull()
    })
  })
})
