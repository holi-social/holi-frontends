import { render, screen } from '@testing-library/react-native'
import React from 'react'

import HoliCalendarIcon, {
  HoliCalendarIconProps,
  HoliCalendarIconSizes,
} from '@holi/ui/components/molecules/HoliCalendarIcon'

describe('renders correctly', () => {
  const monthValues = [...Array.from(Array(12).keys())]
  const dayValues = [...Array.from(Array(31).keys())]
  const booleanValues = [true, false]
  const sizeValues: HoliCalendarIconProps['size'][] = HoliCalendarIconSizes

  monthValues.forEach((month) => {
    dayValues.forEach((day) => {
      booleanValues.forEach((disabled) => {
        sizeValues.forEach((size) => {
          it(`renders correctly when day is '${day + 1}', month is '${
            month + 1
          }', disabled is '${disabled}', size is '${size}'`, () => {
            render(<HoliCalendarIcon day={day + 1} month={month + 1} size={size} disabled={disabled} />)
            expect(screen).toMatchSnapshot()
          })
        })
      })
    })
  })
})

describe('HoliCalendarIcon', () => {
  it('renders the correct shortened and internationalized name of the month', () => {
    render(<HoliCalendarIcon day={22} month={5} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders the correct size of the component', () => {
    render(<HoliCalendarIcon day={1} month={1} size="small" />)
    expect(screen).toMatchSnapshot()
  })

  it('renders the correct disabled state of the component', () => {
    render(<HoliCalendarIcon day={1} month={1} disabled />)
    expect(screen).toMatchSnapshot()
  })
})
