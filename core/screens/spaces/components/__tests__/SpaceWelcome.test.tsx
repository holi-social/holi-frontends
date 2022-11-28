import { render } from '@testing-library/react-native'
import React from 'react'

import SpaceWelcome from '@holi/core/screens/spaces/components/SpaceWelcome'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceWelcome', () => {
  it('renders correctly', () => {
    const { getByText, getByRole } = render(<SpaceWelcome space={space} />)

    const image = getByRole('image')
    expect(image).toHaveProp('source', { uri: 'https://www.example.com/space1.jpg' })
    expect(getByText('Space description')).toBeDefined()
  })
})
