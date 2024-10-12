import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliChip from '@holi/ui/components/molecules/HoliChip'

describe('renders correctly', () => {
  it('renders correctly when checked', () => {
    const tree = renderer.create(<HoliChip text="Test" label="Test" checked />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when unchecked', () => {
    const tree = renderer.create(<HoliChip text="Test" label="Test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    const tree = renderer.create(<HoliChip text="Test" label="Test" disabled />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('calls onPress prop function correctly', () => {
  it('calls onPress prop when not disabled', async () => {
    const mockFn = jest.fn()
    const { getByText } = render(<HoliChip text="Test" label="Test" onPress={mockFn} />)

    fireEvent.press(getByText('Test'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress prop when disabled', async () => {
    const mockFn = jest.fn()
    const { getByText } = render(<HoliChip text="Test" label="Test" onPress={mockFn} disabled={true} />)

    fireEvent.press(getByText('Test'))
    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})

describe('displays icons correctly', () => {
  it('shows check icon when checked', () => {
    const testRenderer = renderer.create(<HoliChip text="Test" label="Test" checked={true} />)
    const holiChipInstance = testRenderer.root

    const iconInstance = holiChipInstance.findByType(HoliIcon)

    expect(iconInstance.props.icon.name).toBe('SvgCheck')
  })

  it('shows add icon when unchecked', () => {
    const testRenderer = renderer.create(<HoliChip text="Test" label="Test" checked={false} />)
    const holiChipInstance = testRenderer.root

    const iconInstance = holiChipInstance.findByType(HoliIcon)

    expect(iconInstance.props.icon.name).toBe('SvgAdd')
  })

  it('shows no icons when disabled', () => {
    const testRenderer = renderer.create(<HoliChip text="Test" label="Test" checked={false} disabled={true} />)
    const holiChipInstance = testRenderer.root

    const iconInstances = holiChipInstance.findAllByType(HoliIcon)

    expect(iconInstances.length).toBe(0)
  })
})
