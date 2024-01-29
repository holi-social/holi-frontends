import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'

describe('HoliLink', () => {
  it('renders child component', () => {
    render(
      <HoliLink label="test" href="/">
        <HoliText>inner</HoliText>
      </HoliLink>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    render(<HoliLink label="test" href="/" onPress={onPress} />)

    fireEvent.press(screen.getByTestId('link'))

    expect(onPress).toHaveBeenCalled()
  })
})
