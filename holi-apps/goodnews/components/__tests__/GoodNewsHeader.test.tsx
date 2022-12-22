import { render, screen } from '@testing-library/react-native'
import React from 'react'

import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'
import { article } from '@holi-apps/goodnews/components/__tests__/testData'

describe('GoodNewsHeader', () => {
  it('renders correctly', () => {
    render(<GoodNewsHeader article={article} />)

    expect(screen.getByText('app.name')).toBeDefined()
    // only checking for test id, as the exact format seems to be os/platform specific
    expect(screen.getByTestId('goodnews-header-date')).toBeDefined()
  })
})
