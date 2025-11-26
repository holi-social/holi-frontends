import { registrationFlow } from '@holi/core/screens/auth/form/hooks/__tests__/testData'
import { useSocialRegistrationForm } from '@holi/core/screens/auth/form/hooks/useSocialRegistrationForm'
import { TrackingEvent } from '@holi/core/tracking'
import { renderHook } from '@testing-library/react-native'

describe('useSocialRegistrationForm', () => {
  describe('submit function', () => {
    it('should do nothing if flow is missing', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() => useSocialRegistrationForm({ performRegistration }))

      await result.current.onSubmit('Google')

      expect(mockTrack).not.toHaveBeenCalled()
      expect(performRegistration).not.toHaveBeenCalled()
    })

    it('should track button press for Google', async () => {
      const { result } = renderHook(() =>
        useSocialRegistrationForm({ flow: registrationFlow, performRegistration: jest.fn() })
      )

      await result.current.onSubmit('Google')

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.RegistrationOptionSelected({
          method: 'google',
          screen: 'mainRegistration',
        })
      )
    })

    it('should track button press for Apple', async () => {
      const { result } = renderHook(() =>
        useSocialRegistrationForm({ flow: registrationFlow, performRegistration: jest.fn() })
      )

      await result.current.onSubmit('Apple')

      expect(mockTrack).toHaveBeenCalledWith(
        TrackingEvent.Auth.RegistrationOptionSelected({
          method: 'apple',
          screen: 'mainRegistration',
        })
      )
    })

    it('should perform registration with correct payload for Apple', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() => useSocialRegistrationForm({ flow: registrationFlow, performRegistration }))

      await result.current.onSubmit('Apple')

      expect(performRegistration).toHaveBeenCalledWith(
        {
          method: 'oidc',
          csrf_token: 'some token',
          provider: 'apple-_KPH8UUU',
        },
        'apple'
      )
    })

    it('should perform registration with correct payload for Google', async () => {
      const performRegistration = jest.fn()
      const { result } = renderHook(() => useSocialRegistrationForm({ flow: registrationFlow, performRegistration }))

      await result.current.onSubmit('Google')

      expect(performRegistration).toHaveBeenCalledWith(
        {
          method: 'oidc',
          csrf_token: 'some token',
          provider: 'google-SBFqZZ_v',
          upstream_parameters: { prompt: 'select_account' },
        },
        'google'
      )
    })
  })
})
