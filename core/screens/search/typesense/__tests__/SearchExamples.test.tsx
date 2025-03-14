import React from 'react'
import { SearchExamples } from '@holi/core/screens/search/typesense/SearchExamples'
import { render, screen, userEvent } from '@testing-library/react-native'

describe('SearchExamples', () => {
  const facets = ['volunteering', 'space', 'profile']
  describe.each(facets)('for facet %s', (facet) => {
    it('should display 5 examples', async () => {
      render(<SearchExamples onQuerySelect={jest.fn()} currentFacet={facet} />)

      const examples = await screen.findAllByText(/search.typesense.examples\./)
      const facetExamples = await screen.findAllByText(new RegExp(`search.typesense.examples.${facet}\\d+`))

      expect(examples).toHaveLength(5 + 1) // +1 as headline has the same prefix
      expect(facetExamples).toHaveLength(5)
    })

    it('should call query selection callback on press', async () => {
      const onQuerySelect = jest.fn()
      const user = userEvent.setup()
      render(<SearchExamples onQuerySelect={onQuerySelect} currentFacet={facet} />)

      const examples = await screen.findAllByLabelText(new RegExp(`search.typesense.examples.${facet}\\d+`))
      const query = examples[0].props['accessibilityLabel']

      await user.press(examples[0])

      expect(onQuerySelect).toHaveBeenCalledWith(query)
      // Event should not have been propagated
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('should use volunteering as fallback facet', async () => {
    render(<SearchExamples onQuerySelect={jest.fn()} currentFacet={'unknown'} />)

    const examples = await screen.findAllByText(/search.typesense.examples\./)
    const facetExamples = await screen.findAllByText(/search.typesense.examples.volunteering\d+/)

    expect(examples).toHaveLength(5 + 1) // +1 as headline has the same prefix
    expect(facetExamples).toHaveLength(5)
  })
})
