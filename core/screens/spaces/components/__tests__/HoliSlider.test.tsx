import { render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import HoliSlider from '@holi/core/screens/spaces/components/HoliSlider'

describe('HoliSlider', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <HoliSlider>
        <Text>Card 1</Text>
        <Text>Card 2</Text>
        <Text>Card 3</Text>
      </HoliSlider>
    )

    expect(getByText('Card 1')).toBeDefined()
    expect(getByText('Card 2')).toBeDefined()
    expect(getByText('Card 3')).toBeDefined()
  })
})
