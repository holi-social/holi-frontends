import { MockedProvider } from '@apollo/client/testing'
import { render } from 'expo-router/testing-library'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceHeader from '@holi/core/screens/spaces/details/components/SpaceHeader'

// TODO: re-enable with HOLI-4898
xdescribe('SpaceHeader', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <MockedProvider addTypename={false}>
        <SpaceHeader space={space} />
      </MockedProvider>
    )

    expect(getByTestId('space-avatar')).toBeDefined()
    expect(getByText('Space title')).toBeDefined()
    expect(getByTestId('space-members')).toBeDefined()
  })
})
