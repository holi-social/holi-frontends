import { NoSearchResults } from '@holi/core/screens/search/NoSearchResults'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

describe('NoSearchResults', () => {
  it('should display text that no results were found', () => {
    render(<NoSearchResults query="foo in bar" />)

    expect(screen.getByText('search.typesense.noResults.headline')).toBeOnTheScreen()
    expect(screen.getByText('search.typesense.noResults.description')).toBeOnTheScreen()
  })
})
