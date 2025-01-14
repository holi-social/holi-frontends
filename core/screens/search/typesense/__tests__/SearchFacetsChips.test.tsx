import React from 'react'
import { facets } from '@holi/core/screens/search/typesense/__tests__/testData'

import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import { render, screen, userEvent } from '@testing-library/react-native'
import { SearchFacetsChips } from '@holi/core/screens/search/typesense/SearchFacetsChips'

const mockUseClearRefinements = useClearRefinements as jest.MockedFunction<typeof useClearRefinements>
const mockUseRefinementList = useRefinementList as jest.MockedFunction<typeof useRefinementList>
jest.mock('react-instantsearch-core', () => ({
  useClearRefinements: jest.fn(),
  useRefinementList: jest.fn(),
}))

describe('SearchFacetsChips', () => {
  const clearRefinement = jest.fn()
  const refine = jest.fn()

  const mockRefinementList = ({ items = facets }: Partial<ReturnType<typeof useRefinementList>> = {}) => {
    mockUseRefinementList.mockReturnValue({
      items,
      hasExhaustiveItems: false,
      createURL: jest.fn(),
      refine,
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
    render(<SearchFacetsChips />)

    const expectedLabels = ['all'].concat(facets.map((facet) => facet.label))
    expectedLabels.forEach((label: string) => {
      expect(screen.getByLabelText(`search.typesense.facets.${label}`)).toBeOnTheScreen()
    })
  })

  it('should refine search on facet press', async () => {
    const user = userEvent.setup()

    render(<SearchFacetsChips />)

    await user.press(screen.getByLabelText('search.typesense.facets.profile'))

    expect(refine).toHaveBeenCalledWith('profile')
  })

  it('should clear previous refinement on facet press', async () => {
    const user = userEvent.setup()

    render(<SearchFacetsChips />)

    await user.press(screen.getByLabelText('search.typesense.facets.profile'))

    expect(clearRefinement).toHaveBeenCalled()
  })

  it('should toggle refinement on already selected facet press', async () => {
    const user = userEvent.setup()

    render(<SearchFacetsChips />)

    await user.press(screen.getByLabelText('search.typesense.facets.space'))

    expect(refine).not.toHaveBeenCalled()
    expect(clearRefinement).toHaveBeenCalled()
  })

  it('should clear refinment but not refine search when facet "all" is pressed', async () => {
    const user = userEvent.setup()

    render(<SearchFacetsChips />)

    await user.press(screen.getByLabelText('search.typesense.facets.all'))

    expect(refine).not.toHaveBeenCalled()
    expect(clearRefinement).toHaveBeenCalled()
  })
})
