import { render } from '@testing-library/react-native'
import React from 'react'

import SpacesFilterHeader from '@holi/core/screens/spaces/components/SpacesFilterHeader'

describe('SpacesFilterHeader', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<SpacesFilterHeader topics={[]} allTopics={true} onPress={() => ({})} />)

    // Checking for text content directly is currently not possible due to open issue:
    // https://github.com/callstack/react-native-testing-library/issues/937
    // expect(getByText('spaces.filter.all')).toBeDefined()
    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all')
  })

  it('renders correctly with location', () => {
    const { getByTestId } = render(
      <SpacesFilterHeader topics={[]} allTopics={true} onPress={() => ({})} location="Hamburg" />
    )

    expect(getByTestId('spaces-filter-header')).toHaveTextContent('spaces.filter.all.location')
  })
})
