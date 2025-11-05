import { renderRouter } from 'expo-router/testing-library'
import { fireEvent, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'

describe('HoliTextLink', () => {
  it('renders child component', () => {
    renderRouter({
      index: () => (
        <HoliTextLink label="test" href="/" size="md">
          inner
        </HoliTextLink>
      ),
    })

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    renderRouter({
      index: () => <HoliTextLink label="test" href="/" onPress={onPress} size="md" />,
    })

    fireEvent.press(screen.getByRole('link'))

    expect(onPress).toHaveBeenCalled()
  })

  it('should navigate on press if no onPress is given', () => {
    const context = renderRouter({
      index: () => <HoliTextLink label="test" href="/spaces" size="md" />,
      spaces: () => <Text>Spaces</Text>,
    })

    fireEvent.press(screen.getByRole('link'))

    expect(context).toHavePathname('/spaces')
  })
})
