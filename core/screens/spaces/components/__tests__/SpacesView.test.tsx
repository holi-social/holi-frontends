import { render } from '@testing-library/react-native'
import React from 'react'

import SpacesView from '@holi/core/screens/spaces/components/SpacesView'
import { user, userWithLocation } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpacesView', () => {
  it('renders correctly without user', () => {
    const { getByText } = render(<SpacesView topics={[]} />)

    // Checking for text content directly is currently not possible due to open issue:
    // https://github.com/callstack/react-native-testing-library/issues/937
    expect(getByText('')).toHaveTextContent('spaces.filter.all')
  })

  it('renders correctly for user', () => {
    const { getByText } = render(<SpacesView topics={[]} user={user} />)

    expect(getByText('')).toHaveTextContent('spaces.filter.all')
  })

  it('renders correctly for user with location', () => {
    const { getByText } = render(<SpacesView topics={[]} user={userWithLocation} />)

    expect(getByText('')).toHaveTextContent('spaces.filter.all.location')
  })
})
