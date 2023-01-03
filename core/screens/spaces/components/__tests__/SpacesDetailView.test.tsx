import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import SpaceDetailView from '@holi/core/screens/spaces/components/SpaceDetailView'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceDetailView', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText } = render(
      <MockedProvider addTypename={false}>
        <SpaceDetailView space={space} />
      </MockedProvider>
    )

    expect(getByText('Space title')).toBeDefined()
    expect(getByText('Space description')).toBeDefined()
    expect(getAllByText('Task title').length).toBe(3)
  })
})
