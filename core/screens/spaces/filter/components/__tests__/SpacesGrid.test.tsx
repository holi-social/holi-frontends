import { render } from '@testing-library/react-native'
import React from 'react'

import { spaces } from '@holi/core/screens/spaces/__tests__/testData'
import SpacesGrid from '@holi/core/screens/spaces/filter/components/SpacesGrid'

describe('SpacesGrid', () => {
  it('renders correctly', () => {
    const { getAllByText, getAllByRole } = render(<SpacesGrid spaces={spaces} />)

    expect(getAllByText('Space title').length).toBe(3)

    const images = getAllByRole('image')
    // expect 3 spaces with 2 images each
    expect(images.length).toBe(6)
    const [coverImage, avatarImage] = images

    let proxiedImgProps = coverImage.props.proxiedProperties
    expect(proxiedImgProps.source).toStrictEqual([{ uri: 'https://www.example.com/space1.jpg' }])

    proxiedImgProps = avatarImage.props.proxiedProperties
    expect(proxiedImgProps.source).toStrictEqual([
      {
        height: 24,
        uri: 'https://dev-images.holi.social/crop:0:0/resize:fill-down:48:48/ext:webp/quality:80/plain/https%3A%2F%2Fwww.example.com%2Favatar.jpg',
        width: 24,
      },
    ])
  })
})
