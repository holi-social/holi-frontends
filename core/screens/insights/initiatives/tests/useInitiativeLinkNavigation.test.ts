import { renderHook } from '@testing-library/react-hooks'
import { Platform } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import useInitiativeLinkNavigation from '@holi/core/screens/insights/initiatives/useInitiativeLinkNavigation'
import { Initiative } from '@holi/core/screens/insights/types'

jest.mock('@holi/core/navigation/hooks/useRouting', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('useInitiativeLinkNavigation', () => {
  const insightId = '1'
  const initiative1 = { id: '1', link: 'https://app.holi.social/initiatives/1' } as Initiative
  const initiative2 = { id: '2', link: 'https://staging.dev.holi.social/initiatives/2' } as Initiative
  const initiative3 = { id: '3', link: 'https://example.com/3' } as Initiative

  beforeEach(() => {
    ;(useRouting as jest.Mock).mockReturnValue({ navigate: jest.fn() })
  })

  describe('Intenal link', () => {
    it('should navigate to internal link details when Platform is android', () => {
      Platform.OS = 'android'

      const { result } = renderHook(() => useInitiativeLinkNavigation(initiative1 as Initiative, insightId))

      result.current.navigate()

      expect(useRouting().navigate).toHaveBeenCalledWith('/initiatives/1')
    })

    it('should navigate to internal link details page when Platform is iOS', () => {
      Platform.OS = 'ios'

      const { result } = renderHook(() => useInitiativeLinkNavigation(initiative1, insightId))

      result.current.navigate()

      expect(useRouting().navigate).toHaveBeenCalledWith('/initiatives/1')
    })

    it('should navigate to internal link details when Platform is web', () => {
      Platform.OS = 'web'
      const { result } = renderHook(() => useInitiativeLinkNavigation(initiative1, insightId))

      result.current.navigate()

      expect(useRouting().navigate).toHaveBeenCalledWith('https://app.holi.social/initiatives/1')
    })

    it('should navigate to internal link details page when link is internal', () => {
      Platform.OS = 'web'
      const { result } = renderHook(() => useInitiativeLinkNavigation(initiative2, insightId))

      result.current.navigate()

      expect(useRouting().navigate).toHaveBeenCalledWith('https://staging.dev.holi.social/initiatives/2')
    })
  })

  describe('External link', () => {
    it('should navigate to initiative details page when link is external', () => {
      Platform.OS = 'web'
      const { result } = renderHook(() => useInitiativeLinkNavigation(initiative3, insightId))

      result.current.navigate()

      expect(useRouting().navigate).toHaveBeenCalledWith('/insights/1/initiatives/3')
    })
  })
})
