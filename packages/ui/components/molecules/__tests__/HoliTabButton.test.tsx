import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'

describe('renders correctly', () => {
  const booleanValues = [true, false]
  booleanValues.forEach((disabled) => {
    booleanValues.forEach((disableFocusability) => {
      it(`renders correctly when disabled is '${disabled}', disableFocusability is '${disableFocusability}'`, () => {
        const tree = renderer
          .create(
            <HoliTabButton label="test" disabled={disabled} disableFocusability={disableFocusability}>
              Test
            </HoliTabButton>
          )
          .toJSON()
        expect(tree).toMatchSnapshot()
      })
    })
  })
})

describe('calls onPress prop function correctly', () => {
  it('calls onPress prop when not disabled', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliTabButton label="test" onPress={mockFn} testID="Tab">
        test
      </HoliTabButton>
    )

    fireEvent.press(getByTestId('Tab'))
    expect(mockFn).toBeCalledTimes(1)
  })

  it('does not call onPress prop when disabled', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliTabButton label="test" onPress={mockFn} testID="Tab" disabled>
        test
      </HoliTabButton>
    )

    fireEvent.press(getByTestId('Tab'))
    expect(mockFn).toBeCalledTimes(0)
  })
})

describe('handles components as children', () => {
  it('renders the passed children', () => {
    const { getByTestId } = render(
      <HoliTabButton label="test" testID="Tab">
        <HoliText testID="Text">foobarbaz</HoliText>
        <HoliIcon icon="home-smile-2" testID="Icon" />
      </HoliTabButton>
    )
    expect(getByTestId('Text')).toBeDefined
    expect(getByTestId('Icon')).toBeDefined
  })
})
