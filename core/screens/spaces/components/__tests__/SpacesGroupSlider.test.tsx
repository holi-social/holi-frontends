import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import SpacesGroupSlider from '@holi/core/screens/spaces/components/SpacesGroupSlider'
import { spaces, topic } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpacesGroupSlider', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText, getAllByRole } = render(<SpacesGroupSlider topic={topic} spaces={spaces} />)

    expect(getByText('Topic title')).toBeDefined()
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

  it('does not display "see more" element if there is nothing more to see', () => {
    const { queryByTestId } = render(<SpacesGroupSlider topic={topic} spaces={spaces} />)

    expect(queryByTestId('spaces-group-slider-see-more')).toBeFalsy()
  })

  it('navigates to topic screen if there is more to see', () => {
    const { getByTestId } = render(<SpacesGroupSlider topic={topic} spaces={spaces} hasMore={true} />)

    fireEvent.press(getByTestId('spaces-group-slider-see-more'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?topicId=TEST_TOPIC')
  })
})
