import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { Text } from './Text'

describe('Text', () => {
  it('should render text', () => {
    render(<Text>Foobar</Text>)

    const text = screen.getByText(/foobar/i)
    expect(text).toBeOnTheScreen()
  })

  it('should set role to heading if level is specified', async () => {
    render(<Text headingLevel="1">Foobar</Text>)

    expect(screen.getByRole('heading')).toBeOnTheScreen()
  })

  it('should set role to none if no level is specified', async () => {
    render(<Text>Foobar</Text>)

    expect((await screen.findByText('Foobar')).props.role).toEqual('none')
  })
})
