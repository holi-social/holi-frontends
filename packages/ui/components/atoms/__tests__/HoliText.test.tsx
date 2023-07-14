import { render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HomeSmile2 } from '@holi/icons/src/generated'
import HoliText, { HoliTextSizes } from '@holi/ui/components/atoms/HoliText'

describe('renders correctly', () => {
  const booleanValues = [true, false]
  const sizeValues = HoliTextSizes
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
      <HoliText testID="Parent">
        <HoliText testID="Child">foobarbaz</HoliText>
        <HoliIcon icon={HomeSmile2} testID="Icon" />
      </HoliText>
    )
    expect(getByTestId('Child')).toBeDefined
    expect(getByTestId('Icon')).toBeDefined
  })
})
