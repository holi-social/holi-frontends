import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { ChipSelect } from './ChipSelect'

describe('ChipSelect', () => {
  it('should render text/children', () => {
    render(<ChipSelect onPress={jest.fn()}>Hai</ChipSelect>)

    expect(screen.root).toHaveTextContent('Hai')
  })

  it('should render counter', () => {
    render(
      <ChipSelect onPress={jest.fn()} counter="42">
        Hai
      </ChipSelect>
    )

    expect(screen.root).toHaveTextContent('42')
  })

  it('should raise press event', () => {
    const mockPressHandler = jest.fn()
    render(<ChipSelect onPress={mockPressHandler}>Click me!</ChipSelect>)

    fireEvent.press(screen.getByText('Click me!'))

    expect(mockPressHandler).toHaveBeenCalledTimes(1)
  })

  it('should not raise press event and be disabled, when disabled', () => {
    const mockPressHandler = jest.fn()
    render(
      <ChipSelect onPress={mockPressHandler} disabled>
        Click me, if you can
      </ChipSelect>
    )

    const chip = screen.getByText('Click me, if you can')
    fireEvent.press(chip)

    expect(mockPressHandler).not.toHaveBeenCalled()
    expect(chip).toBeDisabled()
  })
})
