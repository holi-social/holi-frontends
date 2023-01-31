import { render, screen } from '@testing-library/react-native'
import React from 'react'

import SpaceInfoView from '@holi/core/screens/spaces/components/SpaceInfoView'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'

describe('SpaceInfoView', () => {
  it('renders correctly', () => {
    render(<SpaceInfoView space={space} />)

    expect(screen.getByText('Space description')).toBeDefined()
    expect(screen.getByText('Hamburg, Germany')).toBeDefined()
    expect(screen.getByText('Animal Welfare')).toBeDefined()
    expect(screen.getByText('Environmental Protection')).toBeDefined()
    expect(screen.getByText('spaces.links.heading')).toBeDefined()
  })
})
