import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import GoodNewsArticleComponent from '@holi-apps/goodnews/components/GoodNewsArticleComponent'
import { article } from '@holi-apps/goodnews/components/__tests__/testData'

describe('GoodNewsArticleComponent', () => {
  it('renders correctly', () => {
    render(<GoodNewsArticleComponent article={article} />)

    expect(screen.getByText('Some photographer')).toBeDefined()
    expect(screen.getByText('SOME NEWS')).toBeDefined()
    expect(screen.getByText('Test headline')).toBeDefined()
    expect(screen.getByText('Test teaser')).toBeDefined()
  })

  it('opens article url on button click', () => {
    render(<GoodNewsArticleComponent article={article} />)
    fireEvent.press(screen.getByTestId('btn-to-article-external'))
    expect(mockOpenURL).toHaveBeenCalledWith('https://www.somenews.com/article')
  })
})
