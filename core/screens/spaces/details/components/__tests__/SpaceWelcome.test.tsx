import { render } from 'expo-router/testing-library'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceWelcome from '@holi/core/screens/spaces/details/components/SpaceWelcome'

describe('SpaceWelcome', () => {
  it('renders correctly', () => {
    const { getByText, getByRole } = render(<SpaceWelcome space={space} />)

    const image = getByRole('image')
    expect(image.props).toMatchObject({
      source: {
        uri: 'https://dev-images.holi.social/crop:0:0/resize:fit:1200:1200/ext:webp/quality:80/plain/https%3A%2F%2Fwww.example.com%2Fspace-cover.jpg',
      },
    })
    expect(getByText('Space description')).toBeDefined()
  })
})
