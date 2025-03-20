import React from 'react'
import { SearchExamples } from '@holi/core/screens/search/SearchExamples'
import { render, screen, userEvent } from '@testing-library/react-native'
import { useCurrentRefinements } from 'react-instantsearch-core'
import type {
  CurrentRefinementsConnectorParamsItem,
  CurrentRefinementsConnectorParamsRefinement,
} from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements'

const mockUseCurrentRefinements = useCurrentRefinements as jest.MockedFunction<typeof useCurrentRefinements>
jest.mock('react-instantsearch-core', () => ({
  useCurrentRefinements: jest.fn(),
}))

describe('SearchExamples', () => {
  const mockSelectedFacet = (facet: string) => {
    const items = [
      {
        refinements: [
          {
            label: facet,
            attribute: 'type',
            type: 'facet',
            value: facet,
          },
        ],
      } as CurrentRefinementsConnectorParamsItem,
    ]
    mockUseCurrentRefinements.mockReturnValue({
      items,
      canRefine: true,
      refine: jest.fn(),
      createURL: jest.fn(),
    })
  }

  const facets = ['volunteering', 'space', 'profile']
  describe.each(facets)('for facet %s', (facet) => {
    beforeEach(() => {
      mockSelectedFacet(facet)
    })

    it('should display 5 examples', async () => {
      render(<SearchExamples onQuerySelect={jest.fn()} />)

      const examples = await screen.findAllByText(/search.typesense.examples\./)
      const facetExamples = await screen.findAllByText(new RegExp(`search.typesense.examples.${facet}\\d+`))

      expect(examples).toHaveLength(5 + 1) // +1 as headline has the same prefix
      expect(facetExamples).toHaveLength(5)
    })

    it('should call query selection callback on press', async () => {
      const onQuerySelect = jest.fn()
      const user = userEvent.setup()
      render(<SearchExamples onQuerySelect={onQuerySelect} />)

      const examples = await screen.findAllByLabelText(new RegExp(`search.typesense.examples.${facet}\\d+`))
      const query = examples[0].props['accessibilityLabel']

      await user.press(examples[0])

      expect(onQuerySelect).toHaveBeenCalledWith(query)
      // Event should not have been propagated
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('should use volunteering as fallback facet', async () => {
    const items = [
      {
        refinements: [] as CurrentRefinementsConnectorParamsRefinement[],
      } as CurrentRefinementsConnectorParamsItem,
    ]
    mockUseCurrentRefinements.mockReturnValue({
      items,
      canRefine: true,
      refine: jest.fn(),
      createURL: jest.fn(),
    })

    render(<SearchExamples onQuerySelect={jest.fn()} />)

    const examples = await screen.findAllByText(/search.typesense.examples\./)
    const facetExamples = await screen.findAllByText(/search.typesense.examples.volunteering\d+/)

    expect(examples).toHaveLength(5 + 1) // +1 as headline has the same prefix
    expect(facetExamples).toHaveLength(5)
  })
})
