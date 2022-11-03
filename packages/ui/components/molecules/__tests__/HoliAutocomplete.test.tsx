import { render } from '@testing-library/react-native'
import React from 'react'

import { Primary, WithError } from '@holi/ui/components/molecules/__stories__/HoliAutocomplete.stories'

describe('HoliAutocomplete', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Primary {...Primary.args} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly with error', () => {
    const { toJSON } = render(<WithError {...WithError.args} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
