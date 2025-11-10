import { render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React, { useContext } from 'react'

import { RefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import { RefreshContextProvider } from '@holi/core/refreshing/providers/RefreshContextProvider'

const ContextUsingComponent = () => {
  const context = useContext(RefreshContext)
  return <Text>{context && 'has context'}</Text>
}

describe('RefreshContextProvider', () => {
  it('should render children', () => {
    render(
      <RefreshContextProvider>
        <Text>Child Content</Text>
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
