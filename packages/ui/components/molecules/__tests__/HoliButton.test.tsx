import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HomeSmile2 } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton, {
  HoliButtonProps,
  HoliButtonTypes,
  HoliButtonVariants,
} from '@holi/ui/components/molecules/HoliButton'

describe('renders correctly', () => {
  const booleanValues = [true, false]
  const typeValues: HoliButtonProps['type'][] = HoliButtonTypes
  const variantValues: HoliButtonProps['variant'][] = HoliButtonVariants
  booleanValues.forEach((inline) => {
    booleanValues.forEach((disabled) => {
      booleanValues.forEach((disableFocusability) => {
        typeValues.forEach((type) => {
          variantValues.forEach((variant) => {
            it(`renders correctly when inline is '${inline}', disabled is '${disabled}', disableFocusability is '${disableFocusability}', type is '${type}', variant is '${variant}'`, () => {
              render(
                <HoliButton
                  label="test"
                  inline={inline}
                  disabled={disabled}
                  disableFocusability={disableFocusability}
                  type={type}
                  variant={variant}
                >
                  Test
                </HoliButton>
              )

              expect(screen).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})

describe('calls onPress prop function correctly', () => {
  it('calls onPress prop when not disabled', async () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliButton label="test" onPress={mockFn} testID="Button">
        test
      </HoliButton>
    )

    fireEvent.press(getByTestId('Button'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress prop when disabled', async () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(
      <HoliButton label="test" onPress={mockFn} testID="Button" disabled>
        test
      </HoliButton>
    )

    fireEvent.press(getByTestId('Button'))
    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})

describe('handles components as children', () => {
  it('renders the passed children', () => {
    const { getByTestId } = render(
      <HoliButton label="test" testID="Button">
        <HoliText testID="Text">foobarbaz</HoliText>
        <HoliIcon icon={HomeSmile2} testID="Icon" />
      </HoliButton>
    )
    expect(getByTestId('Text')).toBeDefined
    expect(getByTestId('Icon')).toBeDefined
  })
})
