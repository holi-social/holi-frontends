import { render, screen } from '@testing-library/react-native'
import React from 'react'

import {
  Disabled,
  Multiline,
  MultilineVariant,
  NoLabel,
  Password,
  Primary,
  WithError,
  WithTrailingIcon,
} from '@holi/ui/components/molecules/__stories__/HoliTextInput.stories'

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: () => null,
}))

describe('HoliTextInput', () => {
  it('renders correctly with default props', () => {
    render(<Primary {...Primary.args} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with error', () => {
    render(<WithError {...WithError.args} />)
    expect(screen.root).toHaveTextContent(/Validation Error Text/)
  })

  it('renders correctly without label', () => {
    render(<NoLabel {...NoLabel.args} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when disabled', () => {
    render(<Disabled {...Disabled.args} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when multiline starting with one line', () => {
    render(<Multiline {...Multiline.args} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when multiline starting with more than one line', () => {
    render(<MultilineVariant {...MultilineVariant.args} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with trailing icon', () => {
    render(<WithTrailingIcon {...WithTrailingIcon.args} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with type password', () => {
    render(<Password {...Password.args} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
