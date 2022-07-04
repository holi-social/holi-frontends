import { render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliHeading, { HoliHeadingLevels, HoliHeadingProps, HoliHeadingSizes } from '@holi/ui/components/HoliHeading'
import HoliIcon from '@holi/ui/components/HoliIcon'

describe('renders correctly', () => {
  const booleanValues = [true, false]
  const sizeValues: HoliHeadingProps['size'][] = HoliHeadingSizes
  const levelValues: HoliHeadingProps['level'][] = HoliHeadingLevels
  booleanValues.forEach((selectable) => {
    booleanValues.forEach((bold) => {
      sizeValues.forEach((size) => {
        levelValues.forEach((level) => {
          it(`renders correctly when size is '${size}', level is '${level}', selectable is '${selectable}'`, () => {
            const tree = renderer
              .create(
                <HoliHeading size={size} level={level} selectable={selectable}>
                  Test
                </HoliHeading>
              )
              .toJSON()
            expect(tree).toMatchSnapshot()
          })
        })
      })
    })
  })
})

describe('handles components as children', () => {
  it('renders the passed children', () => {
    const { getByTestId } = render(
      <HoliHeading testID="Parent">
        <HoliHeading testID="Child">foobarbaz</HoliHeading>
        <HoliIcon icon="home" testID="Icon" />
      </HoliHeading>
    )
    expect(getByTestId('Child')).toBeDefined
    expect(getByTestId('Icon')).toBeDefined
  })
})
