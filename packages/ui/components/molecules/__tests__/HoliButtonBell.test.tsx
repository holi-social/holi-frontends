import React from 'react'
import renderer from 'react-test-renderer'

import { Notification2 } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'

describe('React tree', () => {
  it('renders correctly with new notifications badge', () => {
    const tree = renderer
      .create(<HoliButtonBell showBell label="With new notifications" icon={Notification2} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without new notifications badge', () => {
    const tree = renderer.create(<HoliButtonBell label="Without new notifications" icon={Notification2} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
