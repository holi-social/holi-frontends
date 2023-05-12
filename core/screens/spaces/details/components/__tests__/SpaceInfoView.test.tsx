import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInfoView from '@holi/core/screens/spaces/details/components/SpaceInfoView'

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
