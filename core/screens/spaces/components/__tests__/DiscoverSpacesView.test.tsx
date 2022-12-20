import { render } from '@testing-library/react-native'
import React from 'react'

import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { user, userWithLocation } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('DiscoverSpacesView', () => {
  it('renders correctly without user', () => {
    const { getByTestId } = render(<DiscoverSpacesView topics={[]} spaces={[]} />)

    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all')
  })

  it('renders correctly for user', () => {
    const { getByTestId } = render(<DiscoverSpacesView topics={[]} spaces={[]} user={user} />)

    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all')
  })

  it('renders correctly for user with location', () => {
    const { getByTestId } = render(<DiscoverSpacesView topics={[]} spaces={[]} user={userWithLocation} />)

    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all.location')
  })
})
