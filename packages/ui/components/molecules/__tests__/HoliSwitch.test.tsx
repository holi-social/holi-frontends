import { render, screen } from '@testing-library/react-native'
import React from 'react'

import HoliSwitch, { HoliSwitchProps } from '@holi/ui/components/molecules/HoliSwitch'

const props: HoliSwitchProps = {
  size: 'large',
  value: true,
  duration: 500,
}

describe('HoliSwitch', () => {
  it('renders default styling correctly without any props', () => {
    render(<HoliSwitch value={true} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders correctly with styling props', () => {
    render(<HoliSwitch {...props} />)
    expect(screen).toMatchSnapshot()
  })
})
