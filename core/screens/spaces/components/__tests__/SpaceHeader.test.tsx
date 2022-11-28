import { render } from '@testing-library/react-native'
import React from 'react'

import SpaceHeader from '@holi/core/screens/spaces/components/SpaceHeader'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceHeader', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<SpaceHeader space={space} />)

    expect(getByTestId('space-avatar')).toBeDefined()
    expect(getByText('Space title')).toBeDefined()
    expect(getByTestId('space-members')).toBeDefined()
  })
})
