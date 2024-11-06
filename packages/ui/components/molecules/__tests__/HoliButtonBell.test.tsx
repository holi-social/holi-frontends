import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { Notification2 } from '@holi/icons/src/generated'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'

describe('React tree', () => {
  it('renders correctly with new notifications badge', () => {
    render(<HoliButtonBell showBell label="With new notifications" icon={Notification2} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders without new notifications badge', () => {
    render(<HoliButtonBell label="Without new notifications" icon={Notification2} />)
    expect(screen).toMatchSnapshot()
  })
})
