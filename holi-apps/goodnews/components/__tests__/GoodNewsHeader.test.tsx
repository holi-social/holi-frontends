import { render, screen } from 'expo-router/testing-library'
import React from 'react'

import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'

describe('GoodNewsHeader', () => {
  it('renders correctly', () => {
    render(<GoodNewsHeader formattedDate={new Date().toISOString()} />)

    expect(screen.getByText('goodnews.app.name')).toBeDefined()
    // only checking for test id, as the exact format seems to be os/platform specific
    expect(screen.getByTestId('goodnews-header-date')).toBeDefined()
  })
})
