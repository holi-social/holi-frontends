import { render } from '@testing-library/react-native'
import React from 'react'

import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { spacesGroups } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('DiscoverSpacesView', () => {
  it('renders titles and groups correctly when there are both default and user specific groups', () => {
    const { getByTestId, getAllByTestId } = render(
      <DiscoverSpacesView userSpecificSpacesGroups={spacesGroups} defaultSpacesGroups={spacesGroups} />
    )
    expect(getByTestId('discover-spaces-header')).toHaveTextContent('spaces.discover.welcome')
    expect(getByTestId('discover-spaces-description')).toHaveTextContent('spaces.discover.description')
    expect(getByTestId('discover-spaces-others')).toHaveTextContent('spaces.discover.others')
    expect(getAllByTestId('discover-spaces-slider-user-specific').length).toBe(spacesGroups.length)
    expect(getAllByTestId('discover-spaces-slider-others').length).toBe(spacesGroups.length)
  })
})
