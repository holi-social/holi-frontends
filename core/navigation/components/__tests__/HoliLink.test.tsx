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
})
