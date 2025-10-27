import { fireEvent, render, screen } from 'expo-router/testing-library'
import React from 'react'

import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('should render text', () => {
    render(<TextLink size="md">Foobar</TextLink>)

    const link = screen.getByText('Foobar')
    expect(link).toBeOnTheScreen()
  })

  it('should have role passed as prop', async () => {
    render(
      <TextLink size="md" role="link">
        Foobar
      </TextLink>
    )

    expect(screen.getByRole('link')).toBeOnTheScreen()
  })

  it('should call onPress handler', async () => {
    const mockOnPress = jest.fn()
    render(
      <TextLink size="md" onPress={mockOnPress}>
        Foobar
      </TextLink>
    )

    const link = screen.getByText('Foobar')
    fireEvent.press(link)

    expect(mockOnPress).toHaveBeenCalled()
  })
})
