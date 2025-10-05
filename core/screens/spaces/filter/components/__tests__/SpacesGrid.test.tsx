import { render } from 'expo-router/testing-library'
import React from 'react'

import { spaces } from '@holi/core/screens/spaces/__tests__/testData'
import SpacesGrid from '@holi/core/screens/spaces/filter/components/SpacesGrid'

describe('SpacesGrid', () => {
  it('renders correctly', () => {
    const { getAllByText, getAllByRole } = render(<SpacesGrid spaces={spaces} />)

    expect(getAllByText('Space title').length).toBe(3)

    const images = getAllByRole('image')
    // expect 3 spaces with 4 images each (space cover + 3 user avatars)
    expect(images.length).toBe(12)
    const [coverImage, avatarImage] = images

    expect(coverImage.props.source).toStrictEqual({
      height: 240,
      uri: 'https://dev-images.holi.social/crop:0:0/resize:fill-down:718:480/ext:webp/quality:80/plain/https%3A%2F%2Fwww.example.com%2Fspace-cover.jpg',
      width: 359,
    })

    expect(avatarImage.props.source).toStrictEqual({
      height: 24,
      uri: 'https://dev-images.holi.social/crop:0:0/resize:fill-down:48:48/ext:webp/quality:80/plain/https%3A%2F%2Fwww.example.com%2Fuser-avatar.jpg',
      width: 24,
    })
  })
})
