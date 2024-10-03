import { render, screen } from '@testing-library/react-native'
import React from 'react'

import ChipLabel from './ChipLabel'

describe('ChipLabel', () => {
  it('should render text/children', () => {
    render(<ChipLabel>Labelled</ChipLabel>)

    expect(screen.container).toHaveTextContent('Labelled')
  })
})
