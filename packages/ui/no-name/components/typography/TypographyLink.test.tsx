import { render, screen } from '@testing-library/react-native'
import React from 'react'

import TypographyLink from './TypographyLink'

describe('TypographyLink', () => {
  it('should render text', () => {
    render(<TypographyLink size="md">Foobar</TypographyLink>)

    expect(screen.container).toHaveTextContent('Foobar')
  })
})
