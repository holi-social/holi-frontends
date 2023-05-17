import { render } from '@testing-library/react-native'
import React from 'react'

import { spaces } from '@holi/core/screens/spaces/__tests__/testData'
import SpacesGrid from '@holi/core/screens/spaces/filter/components/SpacesGrid'

describe('SpacesGrid', () => {
  // TODO: expo-image - enable after fixing
  it.skip('renders correctly', () => {
    const { getAllByText, getAllByRole } = render(<SpacesGrid spaces={spaces} />)

    expect(getAllByText('Space title').length).toBe(3)

    const images = getAllByRole('image')
    // expect 3 spaces with 2 images each
    expect(images.length).toBe(6)
    const [coverImage, avatarImage] = images

    let proxiedImgProps = coverImage.props.proxiedProperties
    expect(proxiedImgProps.source).toStrictEqual([{ uri: 'https://www.example.com/space1.jpg' }])

    proxiedImgProps = avatarImage.props.proxiedProperties
    expect(proxiedImgProps.source).toStrictEqual([{ uri: 'https://www.example.com/avatar.jpg?tr=w-48', width: 24 }])
  })
})
