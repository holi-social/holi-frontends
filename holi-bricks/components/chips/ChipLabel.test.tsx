import { render, screen } from 'expo-router/testing-library'
import React from 'react'

import { ChipLabel } from './ChipLabel'

describe('ChipLabel', () => {
  it('should render text/children', () => {
    render(<ChipLabel>Labelled</ChipLabel>)

    const text = screen.getByText('Labelled')
    expect(text).toBeOnTheScreen()
  })
})
