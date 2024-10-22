import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('should render text', () => {
    render(<TextLink size="md">Foobar</TextLink>)

    const link = screen.getByRole('link')
    expect(link).toBeOnTheScreen()
    expect(link).toHaveTextContent('Foobar')
  })

  it('should have role link', async () => {
    render(<TextLink size="md">Foobar</TextLink>)

    expect((await screen.findByText('Foobar')).props.role).toEqual('link')
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
