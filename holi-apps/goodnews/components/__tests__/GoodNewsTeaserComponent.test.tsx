import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import GoodNewsTeaserComponent from '@holi-apps/goodnews/components/GoodNewsTeaserComponent'
import { article } from '@holi-apps/goodnews/components/__tests__/testData'

describe('GoodNewsTeaserComponent', () => {
  const memoizedFetchMore = jest.fn()

  it('renders correctly', () => {
    render(<GoodNewsTeaserComponent article={article} fetchMore={memoizedFetchMore} />)
    expect(screen.getByTestId('goodnews-teaser-container')).toBeDefined()
    expect(screen.getByTestId('btn-goodnews-list-load-more')).toBeDefined()
    expect(screen.getByTestId('goodnews-teaser-image')).toBeDefined()
  })

  it('fetching more on button click', async () => {
    render(<GoodNewsTeaserComponent article={article} fetchMore={memoizedFetchMore} />)
    fireEvent.press(screen.getByTestId('btn-goodnews-list-load-more'))

    // timeout is needed because of animation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    expect(memoizedFetchMore).toBeCalled()
  })
})
