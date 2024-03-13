import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { ExternalContentCategory, Quote } from '@holi/core/screens/insights/types'

import QuotesCarousel, { quoteIconColors } from './QuotesCarousel'

const insightId = 'someInsightId'

describe('QuotesCarousel', () => {
  it('does not render cards when no quotes supplied', () => {
    const quotes: Quote[] = []

    render(<QuotesCarousel insightId={insightId} quotes={quotes} />)

    expect(screen.queryByTestId('quote-card-quote')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('quote-card-source')).not.toBeOnTheScreen()
  })

  it('uses three colours repeatedly for four quote icons', () => {
    const quotes: Quote[] = [aQuote(), aQuote(), aQuote(), aQuote()]

    render(<QuotesCarousel insightId={insightId} quotes={quotes} />)

    expect(screen.queryAllByTestId('quote-card-quote')).toHaveLength(4)
    expect(screen.queryAllByTestId('quote-card-source')).toHaveLength(4)

    expect(
      screen
        .getAllByTestId('quote-card-quote-icon')
        .map((el) => el.props)
        .map((prop) => prop.children)
        .map((el) => el.props)
    ).toMatchInlineSnapshot(`
      [
        {
          "color": "${quoteIconColors[0]}",
          "height": 24,
          "width": 24,
        },
        {
          "color": "${quoteIconColors[1]}",
          "height": 24,
          "width": 24,
        },
        {
          "color": "${quoteIconColors[2]}",
          "height": 24,
          "width": 24,
        },
        {
          "color": "${quoteIconColors[0]}",
          "height": 24,
          "width": 24,
        },
      ]
    `)
  })
})

const aQuote = (text?: string) => ({
  id: 'aQuoteId',
  author: 'anAuthor',
  comment: 'aComment',
  category: ExternalContentCategory.ARTICLE,
  authorProfession: 'anAuthorProfession',
  link: 'http://quote.link.holi.social',
  text: text ?? 'text',
  linkPreview: {
    url: 'http://linkpreview.holi.social',
    description: '',
    image: '',
    origin: '',
    siteName: '',
    type: '',
    requestedUrl: '',
    title: 'aTitle',
  },
})
