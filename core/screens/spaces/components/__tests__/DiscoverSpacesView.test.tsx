import { render } from '@testing-library/react-native'
import React from 'react'

import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'

describe('DiscoverSpacesView', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<DiscoverSpacesView spaces={[]} />)

    expect(getByTestId('discover-spaces-header')).toHaveTextContent('spaces.discover.welcome')
    expect(getByTestId('discover-spaces-description')).toHaveTextContent('spaces.discover.description')
  })
})
