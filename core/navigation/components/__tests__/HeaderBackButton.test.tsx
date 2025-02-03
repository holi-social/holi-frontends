import React from 'react'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { render, screen, userEvent } from '@testing-library/react-native'

describe('HeaderBackButton', () => {
  it('should call onPress callback if given', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<HeaderBackButton onPress={onPress} />)

    await user.press(screen.getByLabelText('navigation.headerLeft.back'))

    expect(onPress).toHaveBeenCalled()
  })

  it('should navigate back if onPress is not defined', async () => {
    const user = userEvent.setup()

    render(<HeaderBackButton />)

    await user.press(screen.getByLabelText('navigation.headerLeft.back'))

    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should pass fallbackRoute to back navigation if given', async () => {
    const user = userEvent.setup()

    render(<HeaderBackButton fallbackRoute="/fallback" />)

    await user.press(screen.getByLabelText('navigation.headerLeft.back'))

    expect(mockNavigate).toHaveBeenCalledWith('/fallback')
  })
})
