import { jest } from '@jest/globals'

import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Consent, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'
import { renderHook } from '@testing-library/react-hooks'

jest.mock('@holi/core/helpers/config', () => ({
  posthogKey: 'some.key',
  posthogHost: 'some.host',
}))

jest.mock('@holi/core/tracking/TrackingInitializer')
const useConsentStateMock = useConsentState as jest.Mock

jest.mock('@holi/core/tracking/PosthogCrossPlatform')
const posthogCrossPlatformMock = {
  optedIn: jest.fn(),
  optIn: jest.fn(),
  optOut: jest.fn(),
  reset: jest.fn(),
  capture: jest.fn(),
  identify: jest.fn(),
  distinctId: jest.fn(),
  updatePersonProperties: jest.fn(),
  flush: jest.fn(),
} as PosthogCrossPlatform
const usePosthogCrossPlatformMock = usePosthogCrossPlatform as jest.Mock

jest.unmock('@holi/core/tracking/hooks/useTracking')

beforeEach(() => {
  usePosthogCrossPlatformMock.mockReset()
  useConsentStateMock.mockReset()
})

describe('useTracking', () => {
  describe('when tracking is enabled and consent is given', () => {
    // useTracking shall attach the current consent state for every purpose to every event. This way, when processing
    // events it can be ensured that only events are included for which the user gave explicit consent at the time the
    // event was recorded and the events are only used for the purpose that the user gave consent for.
    describe('and consent for personalization is given', () => {
      it('does add trackingConsentPersonalization=true as an event property', async () => {
        // GIVEN
        usePosthogCrossPlatformMock.mockReturnValue(posthogCrossPlatformMock)
        useConsentStateMock.mockReturnValue([
          {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Given,
          },
          { loading: false },
        ])

        // WHEN
        const { result } = renderHook(() => useTracking())
        result.current.track({
          name: 'testEvent',
          event_version__major: 1,
          event_version__minor: 0,
          event_version__patch: 0,
          properties: {},
        })

        // THEN
        expect(posthogCrossPlatformMock.capture).toHaveBeenCalledWith('testEvent', {
          event_version__major: 1,
          event_version__minor: 0,
          event_version__patch: 0,
          trackingConsentAnalytics: true,
          trackingConsentPersonalization: true,
        })
      })
    })
    describe('and consent for personalization is not given', () => {
      it('does add trackingConsentPersonalization=false as an event property', async () => {
        // GIVEN
        usePosthogCrossPlatformMock.mockReturnValue(posthogCrossPlatformMock)
        useConsentStateMock.mockReturnValue([
          {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Denied,
          },
          { loading: false },
        ])

        // WHEN
        const { result } = renderHook(() => useTracking())
        result.current.track({
          name: 'testEvent',
          event_version__major: 1,
          event_version__minor: 0,
          event_version__patch: 0,
          properties: {},
        })

        // THEN
        expect(posthogCrossPlatformMock.capture).toHaveBeenCalledWith('testEvent', {
          event_version__major: 1,
          event_version__minor: 0,
          event_version__patch: 0,
          trackingConsentAnalytics: true,
          trackingConsentPersonalization: false,
        })
      })
    })
  })
})
