import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import TopicSliderCard from '@holi/core/screens/spaces/components/TopicSliderCard'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('TopicSliderCard', () => {
  it('renders correctly', () => {
    const { getByText, getAllByRole } = render(<TopicSliderCard space={space} />)

    expect(getByText('Space title')).toBeDefined()
    expect(getByText('Space description')).toBeDefined()

    const images = getAllByRole('image')
    expect(images.length).toBe(3)
    expect(images[0]).toHaveProp('source', { uri: 'https://www.example.com/avatar.jpg' })
    expect(images[0]).toHaveProp('accessibilityLabel', 'Some Body')
  })

  it('navigates to space details', () => {
    const { getByTestId } = render(<TopicSliderCard space={space} />)

    fireEvent.press(getByTestId('btn-to-space'))

    expect(mockNavigate).toHaveBeenCalledWith('/spaces/1')
  })
})
