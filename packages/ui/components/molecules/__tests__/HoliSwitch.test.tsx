import React from 'react'
import renderer from 'react-test-renderer'

import HoliSwitch, { HoliSwitchProps } from '@holi/ui/components/molecules/HoliSwitch'
import { colors } from '@holi/ui/styles/globalVars'

const props: HoliSwitchProps = {
  size: 'large',
  switchOn: true,
  duration: 500,
  backgroundColor: colors.background10,
  circleColor: colors.brandA300,
}

describe('HoliSwitch', () => {
  it('renders default styling correctly without any props', () => {
    const tree = renderer.create(<HoliSwitch switchOn={true} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with styling props', () => {
    const tree = renderer.create(<HoliSwitch {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
