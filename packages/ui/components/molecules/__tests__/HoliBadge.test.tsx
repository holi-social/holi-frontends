import React from 'react'
import renderer from 'react-test-renderer'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliBadge, { HoliBadgeProps } from '@holi/ui/components/molecules/HoliBadge'
import { colors } from '@holi/ui/styles/globalVars'

const props: HoliBadgeProps = {
  color: 'gray200',
  backgroundColor: colors.background10,
}

describe('HoliBadge', () => {
  it('renders default styling correctly without any props', () => {
    const tree = renderer
      .create(
        <HoliBadge>
          <HoliText>Holi badge component</HoliText>
        </HoliBadge>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with styling props', () => {
    const tree = renderer
      .create(
        <HoliBadge {...props}>
          <HoliText>Holi badge component</HoliText>
        </HoliBadge>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
