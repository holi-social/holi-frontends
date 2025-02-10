import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text'
import React from 'react'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'

describe('HoliLink', () => {
  it('renders child component', () => {
    render(
      <HoliLink label="test" href="/">
        <Text size="md">inner</Text>
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

  it('should navigate on press if no onPress is given', () => {
    render(<HoliLink label="test" href="/spaces" />)

    fireEvent.press(screen.getByTestId('link'))

    expect(mockNavigate).toHaveBeenCalledWith('//spaces')
  })

  it('should navigate on press if event is not propagated', () => {
    const onPress = jest.fn().mockReturnValue(false)
    render(<HoliLink label="test" href="/" onPress={onPress} />)

    fireEvent.press(screen.getByTestId('link'))

    expect(onPress).toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
