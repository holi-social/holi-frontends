import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import SpaceCard from '@holi/core/screens/spaces/components/SpaceCard'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceCard', () => {
  it('renders correctly', () => {
    const { getByText, getAllByRole } = render(<SpaceCard space={space} />)

    expect(getByText('Space title')).toBeDefined()
    expect(getByText('Space description')).toBeDefined()
    expect(getByText('Hamburg, Germany')).toBeDefined()

    const images = getAllByRole('image')
    expect(images.length).toBe(2)
    const [mainImage, avatarImage] = images
    expect(mainImage).toHaveProp('source', { uri: 'https://www.example.com/space1.jpg' })
    expect(mainImage).toHaveProp('accessibilityLabel', 'Space title')
    expect(avatarImage).toHaveProp('source', { uri: 'https://www.example.com/avatar.jpg' })
    expect(avatarImage).toHaveProp('accessibilityLabel', 'Some Body')
  })

  it('navigates to space details', () => {
    const { getByTestId } = render(<SpaceCard space={space} />)

    fireEvent.press(getByTestId('btn-to-space'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/1')
  })
})
