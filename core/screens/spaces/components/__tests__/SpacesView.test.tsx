import { render } from '@testing-library/react-native'
import React from 'react'

import SpacesView from '@holi/core/screens/spaces/components/SpacesView'
import { user, userWithLocation } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpacesView', () => {
  it('renders correctly without user', () => {
    const { getByTestId } = render(<SpacesView topics={[]} />)

    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all')
  })

  it('renders correctly for user', () => {
    const { getByTestId } = render(<SpacesView topics={[]} user={user} />)

    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all')
  })

  it('renders correctly for user with location', () => {
    const { getByTestId } = render(<SpacesView topics={[]} user={userWithLocation} />)

    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all.location')
  })
})
