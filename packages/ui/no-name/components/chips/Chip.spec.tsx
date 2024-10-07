import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import Chip from './Chip'

describe('Chip', () => {
  it('should render text/children', () => {
    render(<Chip onPress={jest.fn()}>Hai</Chip>)

    const chip = screen.getByText('Hai')
    expect(chip).toBeOnTheScreen()
  })

  it('should raise press event', () => {
    const mockPressHandler = jest.fn()
    render(<Chip onPress={mockPressHandler}>Click me!</Chip>)

    fireEvent.press(screen.getByText('Click me!'))

    expect(mockPressHandler).toHaveBeenCalledTimes(1)
  })

  it('should not raise press event and be disabled, when disabled', () => {
    const mockPressHandler = jest.fn()
    render(
      <Chip onPress={mockPressHandler} disabled>
        Click me, if you can
      </Chip>
    )

    const chip = screen.getByText('Click me, if you can')
    fireEvent.press(chip)

    expect(mockPressHandler).not.toHaveBeenCalled()
    expect(chip).toBeDisabled()
  })
})
