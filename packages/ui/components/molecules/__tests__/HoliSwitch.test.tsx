import React from 'react'
import renderer from 'react-test-renderer'

import HoliSwitch, { HoliSwitchProps } from '@holi/ui/components/molecules/HoliSwitch'

const props: HoliSwitchProps = {
  size: 'large',
  value: true,
  duration: 500,
}

describe('HoliSwitch', () => {
  it('renders default styling correctly without any props', () => {
    const tree = renderer.create(<HoliSwitch value={true} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with styling props', () => {
    const tree = renderer.create(<HoliSwitch {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
