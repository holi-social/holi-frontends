import { render, screen } from '@testing-library/react-native'
import React from 'react'

import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'
import { article } from '@holi-apps/goodnews/components/__tests__/testData'

describe('GoodNewsHeader', () => {
  it('renders correctly', () => {
    render(<GoodNewsHeader article={article} />)

    expect(screen.getByText('app.name')).toBeDefined()
    expect(screen.getByText('12/21/2022')).toBeDefined()
  })
})
