import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import TypographyLink from './TypographyLink'

describe('TypographyLink', () => {
  it('should render text', () => {
    render(<TypographyLink size="md">Foobar</TypographyLink>)

    const link = screen.getByRole('link')
    expect(link).toBeOnTheScreen()
    expect(link).toHaveTextContent('Foobar')
  })

  it('should have role link', async () => {
    render(<TypographyLink size="md">Foobar</TypographyLink>)

    expect((await screen.findByText('Foobar')).props.role).toEqual('link')
  })

  it('should call onPress handler', async () => {
    const mockOnPress = jest.fn()
    render(
      <TypographyLink size="md" onPress={mockOnPress}>
        Foobar
      </TypographyLink>
    )

    const link = screen.getByText('Foobar')
    fireEvent.press(link)

    expect(mockOnPress).toHaveBeenCalled()
  })
})
