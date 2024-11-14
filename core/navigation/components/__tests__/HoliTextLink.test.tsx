import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'

describe('HoliTextLink', () => {
  it('renders child component', () => {
    render(
      <HoliTextLink label="test" href="/" size="md">
        inner
      </HoliTextLink>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    render(<HoliTextLink label="test" href="/" onPress={onPress} size="md" />)

    fireEvent.press(screen.getByRole('link'))

    expect(onPress).toHaveBeenCalled()
  })
})
