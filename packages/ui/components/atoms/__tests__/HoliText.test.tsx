import { render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText, { HoliTextProps, HoliTextSizes } from '@holi/ui/components/atoms/HoliText'

describe('renders correctly', () => {
  const booleanValues = [true, false]
  const sizeValues: HoliTextProps['size'][] = HoliTextSizes
  booleanValues.forEach((selectable) => {
    booleanValues.forEach((bold) => {
      sizeValues.forEach((size) => {
        it(`renders correctly when size is '${size}', bold is '${bold}', selectable is '${selectable}'`, () => {
          const tree = renderer
            .create(
              <HoliText size={size} bold={bold} selectable={selectable}>
                Test
              </HoliText>
            )
            .toJSON()
          expect(tree).toMatchSnapshot()
        })
      })
    })
  })
})

describe('handles components as children', () => {
  it('renders the passed children', () => {
    const { getByTestId } = render(
      <HoliText label="test" testID="Parent">
        <HoliText testID="Child">foobarbaz</HoliText>
        <HoliIcon icon="home-smile" testID="Icon" />
      </HoliText>
    )
    expect(getByTestId('Child')).toBeDefined
    expect(getByTestId('Icon')).toBeDefined
  })
})
