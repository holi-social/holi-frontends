import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'

describe('renders correctly', () => {
  it('renders correctly when open', () => {
    const tree = renderer
      .create(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={true}
          onDismiss={() => null}
          onConfirm={() => null}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when closed', () => {
    const tree = renderer
      .create(
        <HoliConfirmation
          label="Test"
          title="Test Title"
          description="Test Description"
          show={false}
          onDismiss={() => null}
          onConfirm={() => null}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('calls onDismiss prop function correctly', () => {
  it('calls onDismiss prop when clicked on backdrop if dialog is open', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliConfirmation
        label="Test"
        title="Test Title"
        description="Test Description"
        show={true}
        onDismiss={mockFn}
        onConfirm={() => null}
        testID="testconfirmation"
      />
    )

    fireEvent.press(getByTestId('testconfirmation-backdrop'))
    expect(mockFn).toBeCalledTimes(1)
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
        testID="testconfirmation"
      />
    )

    fireEvent.press(getByTestId('testconfirmation-confirm'))
    expect(mockFn).toBeCalledTimes(1)
  })
})
