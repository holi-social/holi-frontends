import { render } from '@testing-library/react-native'
import React from 'react'

import { spacesData } from '@holi/core/screens/spaces/__tests__/testData'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'

describe('HoliSlider', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SpacesHorizontalSlider slideGap={8} spaces={spacesData} />)

    expect(getByText('Card 1')).toBeDefined()
    expect(getByText('Card 2')).toBeDefined()
  })
})
