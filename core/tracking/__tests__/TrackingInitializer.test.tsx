import { MockedProvider } from '@apollo/client/testing'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { render } from '@testing-library/react-native'
import React from 'react'

import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import {
  LoggedInState,
  LoggedInUser,
  LoggedInUserLoading,
  LoggedOut,
} from '@holi/core/screens/userprofile/useLoggedInUser'
import TrackingInitializer from '@holi/core/tracking/TrackingInitializer'
import { trackingEnabled } from '@holi/core/tracking/config'
import { usePosthogCrossPlatform } from '@holi/core/tracking/posthog_cross_platform'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'
import TrackingProvider from '@holi/web/providers/TrackingProvider'

jest.mock('@holi/core/tracking/config')
const trackingEnabledMock = trackingEnabled as jest.Mock
trackingEnabledMock.mockReturnValue(true)

jest.mock('@holi/core/tracking/posthog_cross_platform')
const posthogCrossPlatformMock = {
  optedIn: jest.fn(),
  optIn: jest.fn(),
  optOut: jest.fn(),
  reset: jest.fn(),
  capture: jest.fn(),
  identify: jest.fn(),
} as PosthogCrossPlatform
const usePosthogCrossPlatformMock = usePosthogCrossPlatform as jest.Mock
usePosthogCrossPlatformMock.mockReturnValue(posthogCrossPlatformMock)

jest.mock('@holi/core/auth/helpers/useAuth')

const useLoggedInUserMock: jest.Mock<() => LoggedInState> = jest.fn()

const loggedInStateLoading: LoggedInUserLoading = {
  state: 'loading',
  isLoading: true,
  isLoggedIn: false,
  isLoggedOut: false,
  user: undefined,
  refetch: () => Promise.resolve(),
}

const loggedInStateLoggedOut: LoggedOut = {
  state: 'loggedOut',
  isLoading: false,
  isLoggedIn: false,
  isLoggedOut: true,
  user: undefined,
  refetch: () => Promise.resolve(),
}

const loggedInStateLoggedIn = (consentAnalytics?: boolean, consentPersonalization?: boolean): LoggedInUser => ({
  state: 'loggedIn',
  isLoading: false,
  isLoggedIn: true,
  isLoggedOut: false,
  user: {
    ...getRandomUser(),
    trackingConsentAnalytics: consentAnalytics,
    trackingConsentPersonalization: consentPersonalization,
  } as AuthenticatedUser,
  refetch: () => Promise.resolve(),
})

const mockGetStorage = AsyncStorage.getItem as jest.Mock
const mockWriteStorage = AsyncStorage.setItem as jest.Mock
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
  }
})

const mockAsyncStorage = (consentState: ConsentState): void => {
  const consentToString = (consent: Consent): string => {
    switch (consent) {
      case Consent.Given:
        return 'given'
      case Consent.Denied:
        return 'denied'
      case Consent.Unknown:
        return 'unknown'
    }
  }
  const key = 'HOLI_TRACKING_CONSENT'
  const value = `{"ANALYTICS":"${consentToString(
    consentState[TrackingPurpose.Analytics]
  )}","PERSONALIZATION":"${consentToString(consentState[TrackingPurpose.Personalization])}"}`
  mockGetStorage.mockImplementation((getKey) => {
    if (getKey === key) {
      return Promise.resolve(value)
    } else {
      return Promise.resolve(null)
    }
  })
}

const mockEnv = (loggedInState: LoggedInState, consentState?: ConsentState): void => {
  if (loggedInState.isLoggedIn) {
    const consentAnalytics = consentState ? consentState[TrackingPurpose.Analytics] == Consent.Given : undefined
    const consentPersonalization = consentState
      ? consentState[TrackingPurpose.Personalization] == Consent.Given
      : undefined
    const mockedLoggedInState: LoggedInUser = {
      ...loggedInState,
      user: {
        ...loggedInState.user,
        trackingConsentAnalytics: consentAnalytics,
        trackingConsentPersonalization: consentPersonalization,
      },
    }
    useLoggedInUserMock.mockReturnValue(() => mockedLoggedInState)
  } else {
    useLoggedInUserMock.mockReturnValue(() => loggedInState)
    if (consentState) mockAsyncStorage(consentState)
  }
}

describe('TrackingInitializer', () => {
  describe('while user login state is still loading', () => {
    it.skip('does not initialize tracking on PostHog', () => {
      // TODO HOLI-7894
    })
  })
  describe('for a logged-out user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', () => {
        mockEnv(loggedInStateLoggedOut, ConsentState.unknown)

        render(
          <MockedProvider mocks={[]}>
            <TrackingProvider>
              <TrackingInitializer />
            </TrackingProvider>
          </MockedProvider>
        )

        expect(posthogCrossPlatformMock.optedIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given only analytics consent', () => {
      it.skip('opts-in on PostHog without identifying the user', () => {
        // TODO HOLI-7894
      })
    })
    describe('given only personalization consent', () => {
      it.skip('does not initialize tracking on PostHog', () => {
        // TODO HOLI-7894
      })
    })
    describe('given analytics + personalization consent', () => {
      it.skip('opts-in on PostHog without identifying the user', () => {
        // TODO HOLI-7894
      })
    })
  })
  describe('for a logged-in user', () => {
    describe('given unknown consent', () => {
      it.skip('does not initialize tracking on PostHog', () => {
        // TODO HOLI-7894
      })
    })
    describe('given only analytics consent', () => {
      it.skip('opts-in on PostHog and identifies the user', () => {
        // TODO HOLI-7894
      })
    })
    describe('given only personalization consent', () => {
      it.skip('does not initialize tracking on PostHog', () => {
        // TODO HOLI-7894
      })
    })
    describe('given analytics + personalization consent', () => {
      it.skip('opts-in on PostHog and identifies the user', () => {
        // TODO HOLI-7894
      })
    })
  })
  describe('when a logged-out user without consent gives analytics consent', () => {
    it.skip('opts-in on PostHog without identifying the user', () => {
      // TODO HOLI-7894
    })
  })
  describe('when a logged-in user without consent gives analytics consent', () => {
    it.skip('opts-in on PostHog and identifies the user', () => {
      // TODO HOLI-7894
    })
  })
  describe('when a logged-in user with given consent logs out', () => {
    it.skip('clears local consent storage', () => {
      // TODO HOLI-7894
    })
  })
  describe('when a logged-out user gave analytics consent', () => {
    describe('and has an unknown consent state in the user profile', () => {
      it.skip('"migrates" the locally stored consent to the user profile', () => {
        // TODO HOLI-7894
      })
    })
    describe('and has previously denied consent stored in the user profile', () => {
      it.skip('opts-out of PostHog', () => {
        // TODO HOLI-7894
      })
    })
  })
  describe('when a logged-out user denied analytics consent', () => {
    describe('and then logs in with a previously given consent stored on user profile', () => {
      it.skip('opts-in on PostHog and identifies the user', () => {
        // TODO HOLI-7894
      })
    })
  })
})
