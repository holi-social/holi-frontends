import { render } from '@testing-library/react-native'
import React from 'react'

import SpacesGrid from '@holi/core/screens/spaces/components/SpacesGrid'
import { spaces } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpacesGrid', () => {
  it('renders correctly', () => {
    const { getAllByText, getAllByRole } = render(<SpacesGrid spaces={spaces} />)

    expect(getAllByText('Space title').length).toBe(3)

    const images = getAllByRole('image')
    // expect 3 spaces with 2 images each
    expect(images.length).toBe(6)
    const [mainImage, avatarImage] = images
    expect(mainImage).toHaveProp('source', { uri: 'https://www.example.com/space1.jpg' })
    expect(mainImage).toHaveProp('accessibilityLabel', 'Space title')
    expect(avatarImage).toHaveProp('source', { uri: 'https://www.example.com/avatar.jpg' })
    expect(avatarImage).toHaveProp('accessibilityLabel', 'Some Body')
  })
})
