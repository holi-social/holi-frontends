import { render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React, { useEffect } from 'react'

import { RefreshContext, useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'

const RefreshControlComponent = () => {
  const context = useRefreshContext()

  return <Text>{context.refreshControlProps.refreshing && 'is refreshing'}</Text>
}

const RefreshCallbackRegisteringComponent = ({ callback }: { callback: () => unknown }) => {
  const { registerRefreshHandler } = useRefreshContext()

  useEffect(() => {
    registerRefreshHandler?.(callback)
  }, [callback, registerRefreshHandler])

  return null
}

describe('useRefreshContext', () => {
  it('should pass on refresh control props', () => {
    const context = {
      refreshControlProps: { refreshing: true },
      registerRefreshHandler: jest.fn(),
    }

    render(
      <RefreshContext.Provider value={context}>
        <RefreshControlComponent />
      </RefreshContext.Provider>
    )

    expect(screen.getByText('is refreshing')).toBeDefined()
  })

  it('should provide handler to register refresh callbacks', () => {
    const registerMock = jest.fn()
    const context = {
      refreshControlProps: { refreshing: false },
      registerRefreshHandler: registerMock,
    }
    const callback = () => true

    render(
      <RefreshContext.Provider value={context}>
        <RefreshCallbackRegisteringComponent callback={callback} />
      </RefreshContext.Provider>
    )

    expect(registerMock).toHaveBeenCalledWith(callback)
  })
})
