import { render } from '@testing-library/react-native'
import React from 'react'

import MySpaces from '@holi/core/screens/spaces/components/MySpaces'
import { mySpaces } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('MySpaces', () => {
  it('MySpaces shows all spaces of a user sorted by type (MEMBER, FOLLOWER, CREATOR)', () => {
    const { getByTestId, getByText } = render(<MySpaces mySpaces={mySpaces} />)

    mySpaces.forEach((space) => {
      expect(getByTestId(`section-headline-${space.section.toUpperCase()}`)).toBeVisible()
      expect(getByText(space.spaces.data[0].title)).toBeVisible()
    })
  })
})
