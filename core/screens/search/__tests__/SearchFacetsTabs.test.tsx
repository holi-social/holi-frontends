import React from 'react'
import { facets } from '@holi/core/screens/search/__tests__/testData'

import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import { render, screen, userEvent } from '@testing-library/react-native'
import { SearchFacetsTabs } from '@holi/core/screens/search/SearchFacetsTabs'

const mockUseClearRefinements = useClearRefinements as jest.MockedFunction<typeof useClearRefinements>
const mockUseRefinementList = useRefinementList as jest.MockedFunction<typeof useRefinementList>
jest.mock('react-instantsearch-core', () => ({
  useClearRefinements: jest.fn(),
  useRefinementList: jest.fn(),
}))

describe('SearchFacetsTabs', () => {
  const clearRefinement = jest.fn()
  const mockRefine = jest.fn()

  const mockRefinementList = ({ items = facets }: Partial<ReturnType<typeof useRefinementList>> = {}) => {
    mockUseRefinementList.mockReturnValue({
      items,
      hasExhaustiveItems: false,
      createURL: jest.fn(),
      refine: mockRefine,
      sendEvent: jest.fn(),
      searchForItems: jest.fn(),
      isFromSearch: false,
      canRefine: false,
      canToggleShowMore: false,
      isShowingMore: false,
      toggleShowMore: jest.fn(),
    })
  }

  beforeEach(() => {
    mockRefinementList()
    mockUseClearRefinements.mockReturnValue({
      refine: clearRefinement,
      hasRefinements: false,
      canRefine: false,
      createURL: jest.fn(),
    })
  })

  it('should render available facets', async () => {
    render(<SearchFacetsTabs />)

    const expectedLabels = facets.map((facet) => facet.label)
    expectedLabels.forEach((label: string) => {
      expect(screen.getByLabelText(`search.typesense.facets.${label}`)).toBeOnTheScreen()
    })
  })

  it('should refine search on facet press', async () => {
    const user = userEvent.setup()

    render(<SearchFacetsTabs />)

    await user.press(screen.getByLabelText('search.typesense.facets.profile'))

    expect(mockRefine).toHaveBeenCalledWith('profile')
  })

  it('should clear previous refinement on facet press', async () => {
    const user = userEvent.setup()

    render(<SearchFacetsTabs />)

    await user.press(screen.getByLabelText('search.typesense.facets.profile'))

    expect(clearRefinement).toHaveBeenCalled()
  })

  it('should call callback on facet change', async () => {
    const onFacetChange = jest.fn()
    const user = userEvent.setup()

    render(<SearchFacetsTabs onFacetChange={onFacetChange} />)

    await user.press(screen.getByLabelText('search.typesense.facets.profile'))

    expect(onFacetChange).toHaveBeenCalledWith('profile')
  })

  it('should NOT toggle refinement on already selected facet press', async () => {
    const user = userEvent.setup()

    render(<SearchFacetsTabs initialFacet="space" />)

    // Space is initally selected (in the mocked facet state)
    const chip = screen.getByLabelText('search.typesense.facets.space')
    expect(chip).toHaveAccessibilityState({ selected: true })

    mockRefine.mockReset()

    await user.press(screen.getByLabelText('search.typesense.facets.space'))

    expect(mockRefine).not.toHaveBeenCalled()
    expect(clearRefinement).not.toHaveBeenCalled()
  })

  it('applies initial selection', async () => {
    render(<SearchFacetsTabs initialFacet="space" />)

    const tab = screen.getByLabelText('search.typesense.facets.space')
    expect(tab).toHaveAccessibilityState({ selected: true })
  })

  it('should select volunteering if no initial facet selection is given', async () => {
    render(<SearchFacetsTabs />)

    expect(mockRefine).toHaveBeenCalledWith('volunteering')
  })

  it('should display all facets and order in a stable way', async () => {
    // order should always be [volunteering, spaces, profiles], no matter which order is returned by Typesense
    const expectedOrder = ['volunteering', 'space', 'profile']
    const validateTabOrder = () => {
      const labels = screen
        .getAllByLabelText(/^search\.typesense\.facets\.[^.]+$/)
        .map((facet) => facet.props.accessibilityLabel)
      expect(labels).toEqual(expectedOrder.map((facet) => `search.typesense.facets.${facet}`))
    }

    const { rerender } = render(<SearchFacetsTabs />)
    validateTabOrder()

    mockRefinementList({ items: facets.reverse() })
    rerender(<SearchFacetsTabs />)
    validateTabOrder()

    mockRefinementList({ items: [facets[2], facets[0]] })
    rerender(<SearchFacetsTabs />)
    validateTabOrder()
  })
})
