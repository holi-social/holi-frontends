import { render } from '@testing-library/react-native'
import React from 'react'

import SpaceSocialLinkList from '@holi/core/screens/spaces/components/SpaceSocialLinkList'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceSocialLinkList', () => {
  it('renders correctly', () => {
    const { getByText, getAllByTestId } = render(<SpaceSocialLinkList space={space} />)

    const { links = [] } = space

    expect(getByText('spaces.links.heading')).toBeDefined()
    expect(getAllByTestId('btn-to-social-link').length).toBe(links.length)
  })
})
