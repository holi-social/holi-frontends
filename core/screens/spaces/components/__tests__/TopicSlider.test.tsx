import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import TopicSlider from '@holi/core/screens/spaces/components/TopicSlider'
import { spaces, topic } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('TopicSlider', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText, getAllByRole } = render(<TopicSlider topic={topic} spaces={spaces} />)

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

  it('navigates to topic screen', () => {
    const { getByTestId } = render(<TopicSlider topic={topic} spaces={spaces} />)

    fireEvent.press(getByTestId('spaces-see-more-btn'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/filter?topicId=TEST_TOPIC')
  })
})
