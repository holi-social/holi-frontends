import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from 'expo-router/testing-library'
import React from 'react'

import { mySpaces } from '@holi/core/screens/spaces/__tests__/testData'
import MySpaces from '@holi/core/screens/spaces/discover/components/MySpaces'

describe('MySpaces', () => {
  it('MySpaces shows all spaces of a user sorted by type (MEMBER, FOLLOWER, CREATOR)', () => {
    render(
      <MockedProvider>
        <MySpaces mySpaces={mySpaces} />
      </MockedProvider>
    )

    mySpaces.forEach((space) => {
      expect(screen.getByTestId(`section-headline-${space.section.toUpperCase()}`)).toBeVisible()
      expect(screen.getByText(space.spaces.data[0].title)).toBeVisible()
    })
  })
})
