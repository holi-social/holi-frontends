import { loginFlow } from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { useSocialLoginForm } from '@holi/core/screens/auth/form/hooks/useSocialLoginForm'
import { TrackingEvent } from '@holi/core/tracking'
import { renderHook } from '@testing-library/react-native'

describe('useSocialLoginForm', () => {
  describe('submit function', () => {
    it('should do nothing if flow is missing', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() => useSocialLoginForm({ performLogin }))

      await result.current.onSubmit('Google')

      expect(mockTrack).not.toHaveBeenCalled()
      expect(performLogin).not.toHaveBeenCalled()
    })

    it('should track button press', async () => {
      const { result } = renderHook(() => useSocialLoginForm({ flow: loginFlow, performLogin: jest.fn() }))

      await result.current.onSubmit('Google')

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.SocialLoginButtonPressed({
          provider: 'Google',
          screen: 'mainLogin',
        })
      )
    })

    it('should perform login with correct payload for Apple', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() => useSocialLoginForm({ flow: loginFlow, performLogin }))

      await result.current.onSubmit('Apple')

      expect(performLogin).toHaveBeenCalledWith({
        method: 'oidc',
        csrf_token: 'some token',
        provider: 'apple-_KPH8UUU',
      })
    })

    it('should perform login with correct payload for Google', async () => {
      const performLogin = jest.fn()
      const { result } = renderHook(() => useSocialLoginForm({ flow: loginFlow, performLogin }))

      await result.current.onSubmit('Google')

      expect(performLogin).toHaveBeenCalledWith({
        method: 'oidc',
        csrf_token: 'some token',
        provider: 'google-SBFqZZ_v',
        upstream_parameters: { prompt: 'select_account' },
      })
    })
  })
})
