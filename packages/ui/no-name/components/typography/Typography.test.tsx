import { render, screen } from '@testing-library/react-native'
import React from 'react'

import Typography from './Typography'

describe('Typography', () => {
  it('should render text', () => {
    render(<Typography size="md">Foobar</Typography>)

    const typography = screen.getByText(/foobar/i)
    expect(typography).toBeOnTheScreen()
  })

  it('should set role to heading if level is specified', async () => {
    render(
      <Typography size="md" headingLevel="1">
        Foobar
      </Typography>
    )

    expect((await screen.findByText('Foobar')).props.role).toEqual('heading')
  })

  it('should set role to none if no level is specified', async () => {
    render(<Typography size="md">Foobar</Typography>)

    expect((await screen.findByText('Foobar')).props.role).toEqual('none')
  })
})
