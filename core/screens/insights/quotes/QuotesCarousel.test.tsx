import { render, screen } from 'expo-router/testing-library'
import React from 'react'

import { Quote } from '@holi/core/screens/insights/types'

import QuotesCarousel from './QuotesCarousel'

const insightId = 'someInsightId'

describe('QuotesCarousel', () => {
  it('does not render cards when no quotes supplied', () => {
    const quotes: Quote[] = []

    render(<QuotesCarousel insightId={insightId} quotes={quotes} marginHorizontal={4} />)

    expect(screen.queryByTestId('quote-card-quote')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('quote-card-source')).not.toBeOnTheScreen()
  })
})
