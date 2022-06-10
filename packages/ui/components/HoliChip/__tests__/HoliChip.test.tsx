import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliChip from '@holi/ui/components/HoliChip'

describe('renders correctly', () => {
  it('renders correctly when checked', () => {
    const tree = renderer.create(<HoliChip text="Test" checked={true}></HoliChip>).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when unchecked', () => {
    const tree = renderer.create(<HoliChip text="Test"></HoliChip>).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    const tree = renderer.create(<HoliChip text="Test" disabled={true}></HoliChip>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('calls onPress prop function correctly', () => {
  it('calls onPress prop when not disabled', () => {
    const mockFn = jest.fn()
    const { getByText } = render(<HoliChip text="Test" onPress={mockFn} />)

    fireEvent.press(getByText('Test'))
    expect(mockFn).toBeCalledTimes(1)
  })

  it('does not call onPress prop when disabled', () => {
    const mockFn = jest.fn()
    const { getByText } = render(<HoliChip text="Test" onPress={mockFn} disabled={true} />)

    fireEvent.press(getByText('Test'))
    expect(mockFn).toBeCalledTimes(0)
  })
})

describe('displays icons correctly', () => {
  it('shows check icon when checked', () => {
    const { queryByTestId } = render(<HoliChip text="Test" checked={true} />)

    const checkIcon = queryByTestId('icon-check')
    const plusIcon = queryByTestId('icon-plus')
    expect(checkIcon).toBeDefined()
    expect(plusIcon).toBeNull()
  })

  it('shows plus icon when unchecked', () => {
    const { queryByTestId } = render(<HoliChip text="Test" checked={false} />)

    const checkIcon = queryByTestId('icon-check')
    const plusIcon = queryByTestId('icon-plus')
    expect(checkIcon).toBeNull()
    expect(plusIcon).toBeDefined()
  })

  it('shows no icons when disabled', () => {
    const { queryByTestId } = render(<HoliChip text="Test" checked={false} disabled={true} />)

    const checkIcon = queryByTestId('icon-check')
    const plusIcon = queryByTestId('icon-plus')
    expect(checkIcon).toBeNull()
    expect(plusIcon).toBeNull()
  })
})
