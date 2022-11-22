import { render } from '@testing-library/react-native'
import React from 'react'

import TopicSlider from '@holi/core/screens/spaces/components/TopicSlider'
import { spaces, topic } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('TopicSlider', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText, getAllByRole } = render(<TopicSlider topic={topic.title} spaces={spaces} />)

    expect(getByText('Topic title')).toBeDefined()
    expect(getAllByText('Space title').length).toBe(3)

    const images = getAllByRole('image')
    // expect 3 spaces with 3 members each
    expect(images.length).toBe(9)
    expect(images[0]).toHaveProp('source', { uri: 'https://www.example.com/avatar.jpg' })
    expect(images[0]).toHaveProp('accessibilityLabel', 'Some Body')
  })
})
