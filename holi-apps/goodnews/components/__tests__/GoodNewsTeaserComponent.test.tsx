import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import GoodNewsTeaserComponent from '@holi-apps/goodnews/components/GoodNewsTeaserComponent'
import { article } from '@holi-apps/goodnews/components/__tests__/testData'

describe('GoodNewsTeaserComponent', () => {
  const memoizedFetchMore = jest.fn()

  it('renders correctly', () => {
    render(<GoodNewsTeaserComponent article={article} fetchMore={memoizedFetchMore} />)
    expect(screen.getByTestId('teaser-container')).toBeDefined()
    expect(screen.getByTestId('btn-fetch-more')).toBeDefined()
    expect(screen.getByTestId('teaser-image')).toBeDefined()
  })

  it('renders animation correctly and fetching more on button click', () => {
    render(<GoodNewsTeaserComponent article={article} fetchMore={memoizedFetchMore} />)
    fireEvent.press(screen.getByTestId('btn-fetch-more'))

    setTimeout(() => {
      expect(screen.getByTestId('teaser-image-container')).toHaveAnimatedStyle({
        transform: [
          {
            translateY: {
              inputRange: [1],
              outputRange: [-450],
            },
          },
          {
            scale: {
              inputRange: [1],
              outputRange: [1.5],
            },
          },
        ],
      })
      expect(memoizedFetchMore).toBeCalled()
    }, 700)
  })
})
