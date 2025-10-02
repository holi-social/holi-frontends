import { renderHook } from '@testing-library/react-hooks'
import {
  useTrackCurrentRoute,
  getCurrentRouteInfo,
  setCurrentRouteInfo,
  resetCurrentRouteInfo,
} from '@holi/core/navigation/hooks/useCurrentRoute'

// Mock expo-router
let mockPathname = '/'
let mockParams = {}

jest.mock('expo-router', () => ({
  usePathname: () => mockPathname,
  useGlobalSearchParams: () => mockParams,
}))

describe('useCurrentRoute', () => {
  beforeEach(() => {
    resetCurrentRouteInfo()
    mockPathname = '/'
    mockParams = {}
  })

  describe('getCurrentRouteInfo', () => {
    it('should return default route info initially', () => {
      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/',
        params: {},
      })
    })

    it('should return updated route info after tracking', () => {
      mockPathname = '/chat'
      mockParams = { tab: 'messages' }

      renderHook(() => useTrackCurrentRoute())

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/chat',
        params: { tab: 'messages' },
      })
    })

    it('should track route changes', () => {
      mockPathname = '/spaces'
      mockParams = {}

      const { rerender } = renderHook(() => useTrackCurrentRoute())

      expect(getCurrentRouteInfo().pathname).toBe('/spaces')

      mockPathname = '/spaces/123'
      mockParams = { spaceId: '123' }
      rerender()

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/spaces/123',
        params: { spaceId: '123' },
      })
    })

    it('should handle complex params', () => {
      mockPathname = '/chat/rooms/room123'
      mockParams = {
        roomId: 'room123',
        filter: ['unread', 'mentions'],
        sort: 'date',
      }

      renderHook(() => useTrackCurrentRoute())

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/chat/rooms/room123',
        params: {
          roomId: 'room123',
          filter: ['unread', 'mentions'],
          sort: 'date',
        },
      })
    })
  })

  describe('setCurrentRouteInfo', () => {
    it('should set route info directly', () => {
      setCurrentRouteInfo('/profile/settings', { section: 'notifications' })

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/profile/settings',
        params: { section: 'notifications' },
      })
    })

    it('should set route info without params', () => {
      setCurrentRouteInfo('/home')

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/home',
        params: {},
      })
    })

    it('should override previous route info', () => {
      setCurrentRouteInfo('/chat', { tab: 'all' })
      setCurrentRouteInfo('/spaces', { view: 'grid' })

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/spaces',
        params: { view: 'grid' },
      })
    })
  })

  describe('resetCurrentRouteInfo', () => {
    it('should reset route info to defaults', () => {
      setCurrentRouteInfo('/some/path', { key: 'value' })
      resetCurrentRouteInfo()

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo).toEqual({
        pathname: '/',
        params: {},
      })
    })
  })

  describe('useTrackCurrentRoute', () => {
    it('should sync with expo-router pathname and params', () => {
      mockPathname = '/feed'
      mockParams = { filter: 'following' }

      renderHook(() => useTrackCurrentRoute())

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo.pathname).toBe('/feed')
      expect(routeInfo.params).toEqual({ filter: 'following' })
    })

    it('should update when pathname changes', () => {
      mockPathname = '/chat'
      const { rerender } = renderHook(() => useTrackCurrentRoute())

      expect(getCurrentRouteInfo().pathname).toBe('/chat')

      mockPathname = '/chat/rooms/abc'
      rerender()

      expect(getCurrentRouteInfo().pathname).toBe('/chat/rooms/abc')
    })

    it('should update when params change', () => {
      mockPathname = '/spaces'
      mockParams = { view: 'list' }
      const { rerender } = renderHook(() => useTrackCurrentRoute())

      expect(getCurrentRouteInfo().params).toEqual({ view: 'list' })

      mockParams = { view: 'grid' }
      rerender()

      expect(getCurrentRouteInfo().params).toEqual({ view: 'grid' })
    })

    it('should handle empty params', () => {
      mockPathname = '/profile'
      mockParams = {}

      renderHook(() => useTrackCurrentRoute())

      const routeInfo = getCurrentRouteInfo()
      expect(routeInfo.params).toEqual({})
    })
  })
})
