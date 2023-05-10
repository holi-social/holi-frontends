import { render } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceWelcome from '@holi/core/screens/spaces/details/components/SpaceWelcome'

describe('SpaceWelcome', () => {
  it('renders correctly', () => {
    const { getByText, getByRole } = render(<SpaceWelcome space={space} />)

    const image = getByRole('image')
    expect(image.props.proxiedProperties).toMatchObject({
      source: [{ uri: 'https://www.example.com/space1.jpg' }],
    })
    expect(getByText('Space description')).toBeDefined()
  })
})
