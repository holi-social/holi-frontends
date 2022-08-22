import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
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
              const tree = renderer
                .create(
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
                .toJSON()
              expect(tree).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})

describe('calls onPress prop function correctly', () => {
  it('calls onPress prop when not disabled', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliButton label="test" onPress={mockFn} testID="Button"></HoliButton>)

    fireEvent.press(getByTestId('Button'))
    expect(mockFn).toBeCalledTimes(1)
  })

  it('does not call onPress prop when disabled', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliButton label="test" onPress={mockFn} testID="Button" disabled></HoliButton>)

    fireEvent.press(getByTestId('Button'))
    expect(mockFn).toBeCalledTimes(0)
  })
})

describe('handles components as children', () => {
  it('renders the passed children', () => {
    const { getByTestId } = render(
      <HoliButton label="test" testID="Button">
        <HoliText testID="Text">foobarbaz</HoliText>
        <HoliIcon icon="home-smile-2" testID="Icon" />
      </HoliButton>
    )
    expect(getByTestId('Text')).toBeDefined
    expect(getByTestId('Icon')).toBeDefined
  })
})
