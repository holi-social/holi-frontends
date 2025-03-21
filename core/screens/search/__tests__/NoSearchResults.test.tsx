import { NoSearchResults } from '@holi/core/screens/search/NoSearchResults'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

describe('NoSearchResults', () => {
  it('should display text that no results were found for the given query', () => {
    render(<NoSearchResults filter={{ query: 'foo in bar', facet: 'volunteering' }} />)

    expect(screen.getByText('search.typesense.noResults.headline')).toBeOnTheScreen()
    expect(screen.getByText('search.typesense.noResults.description')).toBeOnTheScreen()
  })

  it('should display text that no results were found for the given location if the query is empty', () => {
    render(
      <NoSearchResults
        filter={{ query: '', facet: 'volunteering', location: { id: '1', label: 'Hamburg, Germany' } }}
      />
    )

    expect(screen.getByText('search.typesense.noResultsLocation.headline')).toBeOnTheScreen()
    expect(screen.getByText('search.typesense.noResults.description')).toBeOnTheScreen()
  })
})
