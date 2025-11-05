//import { render } from '@testing-library/react-native'
import { render } from 'expo-router/testing-library'

import React from 'react'

import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useOnRefresh as useOnRefreshWeb } from '@holi/core/refreshing/hooks/useOnRefresh.web'
import { RefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'

const mockUseFocusEffect = jest.fn()
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: unknown) => mockUseFocusEffect(callback),
}))

const RefreshingComponent = ({ callback }: { callback: () => unknown }) => {
  useOnRefresh(callback)

  return null
}

const RefreshingWebComponent = ({ callback }: { callback: () => unknown }) => {
  useOnRefreshWeb(callback)

  return null
}

describe('useOnRefresh', () => {
  describe('mobile', () => {
    it('should register refresh callback', () => {
      mockUseFocusEffect.mockImplementation((callback) => callback())
      const registerMock = jest.fn()
      const context = {
        registerRefreshHandler: registerMock,
        refreshControlProps: { refreshing: false },
      }
      const callback = () => true

      render(
        <RefreshContext.Provider value={context}>
          <RefreshingComponent callback={callback} />
        </RefreshContext.Provider>
      )

      expect(registerMock).toHaveBeenCalledWith(callback)
    })
  })

  describe('web', () => {
    it('should register refresh callback', () => {
      const registerMock = jest.fn()
      const context = {
        registerRefreshHandler: registerMock,
        refreshControlProps: { refreshing: false },
      }
      const callback = () => true

      render(
        <RefreshContext.Provider value={context}>
          <RefreshingWebComponent callback={callback} />
        </RefreshContext.Provider>
      )

      expect(registerMock).toHaveBeenCalledWith(callback)
    })
  })
})
