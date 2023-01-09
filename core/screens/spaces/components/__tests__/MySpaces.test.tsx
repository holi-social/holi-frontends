import { render } from '@testing-library/react-native'
import React from 'react'

import MySpaces from '@holi/core/screens/spaces/components/MySpaces'
import { mySpaces } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('MySpaces', () => {
  it('MySpaces shows all spaces of a user sorted by type (MEMBER, FOLLOWER, CREATOR)', () => {
    const { getByTestId, getByText } = render(<MySpaces mySpaces={mySpaces} />)

    expect(getByTestId('section-headline-MEMBER')).toBeVisible()
    expect(getByText(mySpaces[0].spaces.data[0].title)).toBeVisible()

    expect(getByTestId('section-headline-CREATOR')).toBeVisible()
    expect(getByText(mySpaces[1].spaces.data[0].title)).toBeVisible()

    expect(getByTestId('section-headline-FOLLOWER')).toBeVisible()
    expect(getByText(mySpaces[2].spaces.data[0].title)).toBeVisible()
  })
})
