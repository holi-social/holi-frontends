import { render, screen } from '@testing-library/react-native'
import React from 'react'

import Typography from './Typography'

describe('Typography', () => {
  it('should render text', () => {
    render(<Typography size="md">Foobar</Typography>)

    expect(screen.container).toHaveTextContent('Foobar')
  })

  it('should set role to heading if level is specified', async () => {
    render(
      <Typography size="md" headingLevel="1" testID="test">
        Foobar
      </Typography>
    )

    expect((await screen.findByTestId('test')).props.role).toEqual('heading')
  })

  it('should set role to none if no level is specified', async () => {
    render(
      <Typography size="md" testID="test">
        Foobar
      </Typography>
    )

    expect((await screen.findByTestId('test')).props.role).toEqual('none')
  })
})
