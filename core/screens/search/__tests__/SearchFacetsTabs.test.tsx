import React from 'react'

import { renderRouter } from 'expo-router/testing-library'
import { screen, userEvent } from '@testing-library/react-native'
import { SearchFacetsTabs } from '@holi/core/screens/search/SearchFacetsTabs'

describe('SearchFacetsTabs', () => {
  it('should render available facets', async () => {
    renderRouter({
      index: () => <SearchFacetsTabs currentFacet="volunteering" onFacetChange={jest.fn()} />,
    })

    expect(screen.getByLabelText('search.facets.volunteering')).toBeOnTheScreen()
    expect(screen.getByLabelText('search.facets.space')).toBeOnTheScreen()
    expect(screen.getByLabelText('search.facets.profile')).toBeOnTheScreen()
  })

  it('should call callback on facet change', async () => {
    const onFacetChange = jest.fn()
    const user = userEvent.setup()

    renderRouter({
      index: () => <SearchFacetsTabs currentFacet="volunteering" onFacetChange={onFacetChange} />,
    })

    await user.press(screen.getByLabelText('search.facets.profile'))

    expect(onFacetChange).toHaveBeenCalledWith('profile')
  })

  it('applies initial selection', async () => {
    renderRouter({
      index: () => <SearchFacetsTabs currentFacet="space" onFacetChange={jest.fn()} />,
    })

    const tab = screen.getByLabelText('search.facets.space')
    expect(tab).toBeSelected()
  })
})
