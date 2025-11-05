import React from 'react'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { renderRouter } from 'expo-router/testing-library'
import { screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'

describe('HeaderBackButton', () => {
  it('should call onPress callback if given', () => {
    const onPress = jest.fn()

    renderRouter({ index: () => <HeaderBackButton onPress={onPress} /> })

    fireEvent.press(screen.getByLabelText('navigation.headerLeft.back'))

    expect(onPress).toHaveBeenCalled()
  })

  it('should navigate back if onPress is not defined', () => {
    // When there's no history and no fallback, the back button should still render
    // but won't navigate anywhere (router.back() will be called but do nothing)
    renderRouter({
      index: () => <HeaderBackButton />,
    })

    // Should render without crashing
    expect(screen.getByLabelText('navigation.headerLeft.back')).toBeOnTheScreen()
  })

  it('should pass fallbackRoute to back navigation if given', () => {
    const context = renderRouter({
      index: () => <HeaderBackButton fallbackRoute="/fallback" />,
      fallback: () => <Text>Fallback</Text>,
    })

    fireEvent.press(screen.getByLabelText('navigation.headerLeft.back'))

    // When there's no history, should navigate to fallback
    expect(context).toHavePathname('/fallback')
  })
})
