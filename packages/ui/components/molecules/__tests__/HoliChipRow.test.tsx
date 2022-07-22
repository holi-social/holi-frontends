import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

describe('renders correctly', () => {
  it('renders correctly when there is no title, not editable and has no children', () => {
    const tree = renderer.create(<HoliChipRow></HoliChipRow>).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when there is a title, is editable and has children', () => {
    const tree = renderer
      .create(
        <HoliChipRow title="Test" editable>
          <HoliText>Testing</HoliText>
        </HoliChipRow>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('calls onPressEdit prop function correctly', () => {
  it('calls onPressEdit prop when not disabled', () => {
    const mockFn = jest.fn()
    const { getByText } = render(<HoliChipRow title="Test" onPressEdit={mockFn} editButtonText="Edit" editable />)

    fireEvent.press(getByText('Edit'))
    expect(mockFn).toBeCalledTimes(1)
  })

  it('does not display edit button when not editable', () => {
    const mockFn = jest.fn()
    const testRenderer = renderer.create(<HoliChipRow title="Test" onPressEdit={mockFn} editButtonText="Edit" />)

    const HoliChipRowInstance = testRenderer.root
    const editButtonInstance = HoliChipRowInstance.findAllByType(HoliButton)

    expect(editButtonInstance.length).toBe(0)
  })
})
