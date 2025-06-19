import React from 'react'
import { SearchExamples } from '@holi/core/screens/search/SearchExamples'
import { render, screen, userEvent } from '@testing-library/react-native'
import { SEARCH_FACETS_IN_ORDER } from '@holi/core/screens/search/types'

describe('SearchExamples', () => {
  describe.each(SEARCH_FACETS_IN_ORDER)('for facet %s', (facet) => {
    it('should display 5 examples', async () => {
      render(<SearchExamples onQuerySelect={jest.fn()} currentFacet={facet} />)

      const examples = await screen.findAllByText(/search.examples\./)
      const facetExamples = await screen.findAllByText(new RegExp(`search.examples.${facet}\\d+`))

      expect(examples).toHaveLength(5 + 1) // +1 as headline has the same prefix
      expect(facetExamples).toHaveLength(5)
    })

    it('should call query selection callback on press', async () => {
      const onQuerySelect = jest.fn()
      const user = userEvent.setup()
      render(<SearchExamples onQuerySelect={onQuerySelect} currentFacet={facet} />)

      const examples = await screen.findAllByLabelText(new RegExp(`search.examples.${facet}\\d+`))
      const query = examples[0].props['accessibilityLabel']

      await user.press(examples[0])

      expect(onQuerySelect).toHaveBeenCalledWith(query)
      // Event should not have been propagated
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
