import React from 'react'
import { SearchExamples } from '@holi/core/screens/search/SearchExamples'
import { renderRouter } from 'expo-router/testing-library'
import { screen, fireEvent } from '@testing-library/react-native'
import { SEARCH_FACETS_IN_ORDER } from '@holi/core/screens/search/types'
import { Text } from 'react-native'

describe('SearchExamples', () => {
  describe.each(SEARCH_FACETS_IN_ORDER)('for facet %s', (facet) => {
    it('should display 5 examples', async () => {
      renderRouter({ index: () => <SearchExamples onQuerySelect={jest.fn()} currentFacet={facet} /> })

      const examples = await screen.findAllByText(/search.examples\./)
      const facetExamples = await screen.findAllByText(new RegExp(`search.examples.${facet}\\d+`))

      expect(examples).toHaveLength(5 + 1) // +1 as headline has the same prefix
      expect(facetExamples).toHaveLength(5)
    })

    it('should call query selection callback on press', async () => {
      const onQuerySelect = jest.fn()
      renderRouter({
        index: () => <SearchExamples onQuerySelect={onQuerySelect} currentFacet={facet} />,
        search: () => <Text>Search</Text>,
      })

      const examples = await screen.findAllByLabelText(new RegExp(`search.examples.${facet}\\d+`))
      const query = examples[0].props.accessibilityLabel || examples[0].props['aria-label']

      fireEvent.press(examples[0])

      expect(onQuerySelect).toHaveBeenCalledWith(query)
    })
  })
})
