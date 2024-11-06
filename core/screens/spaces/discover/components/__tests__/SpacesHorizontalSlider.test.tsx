import { render } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'

import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'

describe('HoliSlider', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <SpacesHorizontalSlider cardWidth={0} slideGap={0}>
        <Text size="md">Card 1</Text>
        <Text size="md">Card 2</Text>
        <Text size="md">Card 3</Text>
      </SpacesHorizontalSlider>
    )

    expect(getByText('Card 1')).toBeDefined()
    expect(getByText('Card 2')).toBeDefined()
    expect(getByText('Card 3')).toBeDefined()
  })
})
