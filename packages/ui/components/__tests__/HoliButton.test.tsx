import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliText from '@holi/ui/components/HoliText'

/*
label: string
style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
inline?: boolean
type?: 'primary' | 'secondary'
variant?: 'default' | 'small' | 'transparent'
disabled?: boolean
children?: ReactChild | ReactChild[] | ReactChildren | Array<ReactChild> | string
disableFocusability?: boolean
// only for TS (props are added by {...props})
onPress?: null | ((event: GestureResponderEvent) => void)
testID?: string
*/

describe('renders correctly', () => {
  const booleanValues = [true, false]
  const typeValues: ('primary' | 'secondary')[] = ['primary', 'secondary']
  const variantValues: ('default' | 'small' | 'transparent')[] = ['default', 'small', 'transparent']
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
        <HoliIcon icon="home" testID="Icon" />
      </HoliButton>
    )
    expect(getByTestId('Text')).toBeDefined
    expect(getByTestId('Icon')).toBeDefined
  })
})
