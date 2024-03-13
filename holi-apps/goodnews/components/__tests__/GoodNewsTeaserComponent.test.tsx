import { act, fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import GoodNewsTeaserComponent from '@holi-apps/goodnews/components/GoodNewsTeaserComponent'
import { article } from '@holi-apps/goodnews/components/__tests__/testData'

describe('GoodNewsTeaserComponent', () => {
  const fetchMoreSpy = jest.fn()

  it('renders correctly', () => {
    render(<GoodNewsTeaserComponent article={article} fetchMore={fetchMoreSpy} />)
    expect(screen.getByTestId('goodnews-teaser-container')).toBeDefined()
    expect(screen.getByTestId('btn-goodnews-list-load-more')).toBeDefined()
    expect(screen.getByTestId('goodnews-teaser-image')).toBeDefined()
  })

  it('fetching more on button click', async () => {
    jest.useFakeTimers()

    render(<GoodNewsTeaserComponent article={article} fetchMore={fetchMoreSpy} />)

    fireEvent.press(screen.getByTestId('btn-goodnews-list-load-more'))

    act(() => {
      jest.runAllTimers()
      expect(fetchMoreSpy).toHaveBeenCalled()
    })

    jest.useRealTimers()
  })
})
