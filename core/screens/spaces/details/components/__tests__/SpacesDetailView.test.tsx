import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetailView from '@holi/core/screens/spaces/details/components/SpaceDetailView'

// TODO: re-enable with HOLI-4898
xdescribe('SpaceDetailView', () => {
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
