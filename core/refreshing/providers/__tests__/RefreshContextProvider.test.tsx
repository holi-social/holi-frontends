import { render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React, { useContext } from 'react'

import { RefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import { RefreshContextProvider } from '@holi/core/refreshing/providers/RefreshContextProvider'

const ContextUsingComponent = () => {
  const context = useContext(RefreshContext)
  return <Text size="md">{context && 'has context'}</Text>
}

describe('RefreshContextProvider', () => {
  it('should render children', () => {
    render(
      <RefreshContextProvider>
        <Text size="md">Child Content</Text>
      </RefreshContextProvider>
    )
    expect(screen.getByText('Child Content')).toBeDefined()
  })

  it('should provide the refresh context', () => {
    render(
      <RefreshContextProvider>
        <ContextUsingComponent />
      </RefreshContextProvider>
    )
    expect(screen.getByText('has context')).toBeDefined()
  })
})
