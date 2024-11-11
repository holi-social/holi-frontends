import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HomeSmile2 } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'

describe('renders correctly', () => {
  const booleanValues = [true, false]
  booleanValues.forEach((disabled) => {
    booleanValues.forEach((disableFocusability) => {
      it(`renders correctly when disabled is '${disabled}', disableFocusability is '${disableFocusability}'`, () => {
        render(
          <HoliTabButton label="test" disabled={disabled} disableFocusability={disableFocusability}>
            Test
          </HoliTabButton>
        )
        expect(screen).toMatchSnapshot()
      })
    })
  })
})

describe('calls onPress prop function correctly', () => {
  it('calls onPress prop when not disabled', async () => {
    const mockFn = jest.fn()
    render(
      <HoliTabButton label="test" onPress={mockFn} testID="Tab">
        test
      </HoliTabButton>
    )

    await userEvent.press(screen.getByTestId('Tab'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress prop when disabled', () => {
    const mockFn = jest.fn()
    render(
      <HoliTabButton label="test" onPress={mockFn} testID="Tab" disabled>
        test
      </HoliTabButton>
    )

    userEvent.press(screen.getByTestId('Tab'))
    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})

describe('handles components as children', () => {
  it('renders the passed children', () => {
    render(
      <HoliTabButton label="test" testID="Tab">
        <HoliText testID="Text">foobarbaz</HoliText>
        <HoliIcon icon={HomeSmile2} testID="Icon" />
      </HoliTabButton>
    )
    expect(screen.getByTestId('Text')).toBeDefined()
    expect(screen.getByTestId('Icon')).toBeDefined()
  })
})
