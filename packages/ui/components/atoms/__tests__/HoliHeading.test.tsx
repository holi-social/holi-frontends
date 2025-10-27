import { render, screen } from 'expo-router/testing-library'
import React from 'react'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HomeSmile2 } from '@holi/icons/src/generated'
import { HoliHeading, HoliHeadingLevel, HoliHeadingSize } from '@holi/ui/components/atoms/HoliHeading'

describe('renders correctly', () => {
  const booleanValues = [true, false]
  const sizeValues: HoliHeadingSize[] = ['xl', 'l', 'm', 's']
  const levelValues: HoliHeadingLevel[] = ['1', '2', '3']

  booleanValues.forEach((selectable) => {
    sizeValues.forEach((size) => {
      levelValues.forEach((level) => {
        it(`renders correctly when size is '${size}', level is '${level}', selectable is '${selectable}'`, () => {
          render(
            <HoliHeading size={size} level={level} selectable={selectable}>
              Test
            </HoliHeading>
          )
          expect(screen.toJSON()).toMatchSnapshot()
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
        <HoliIcon icon={HomeSmile2} testID="Icon" />
      </HoliHeading>
    )
    expect(getByTestId('Child')).toBeDefined()
    expect(getByTestId('Icon')).toBeDefined()
  })
})
