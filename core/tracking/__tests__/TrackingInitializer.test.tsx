import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { VariableMatcher } from '@apollo/client/testing/core/mocking/mockLink'
import { jest } from '@jest/globals'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { UpdateAuthenticatedUserInput, updateAuthenticatedUserV2Mutation } from '@holi/core/screens/userprofile/queries'
import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import {
  LoggedInState,
  LoggedInUser,
  LoggedInUserLoading,
  LoggedOut,
  useLoggedInUser,
} from '@holi/core/screens/userprofile/useLoggedInUser'
import TrackingInitializer, {
  consentStateVar,
  consentStateVarInitial,
  updateConsentState,
} from '@holi/core/tracking/TrackingInitializer'
import { trackingEnabled } from '@holi/core/tracking/config'
import { usePosthogCrossPlatform } from '@holi/core/tracking/posthog_cross_platform'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'
import TrackingProvider from '@holi/web/providers/TrackingProvider'

Object.defineProperty(window, 'navigator', {
  value: {},
  writable: true,
})

jest.mock('@holi/core/tracking/config')
const trackingEnabledMock = trackingEnabled as jest.Mock

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

jest.mock('@holi/core/screens/userprofile/useLoggedInUser')
const useLoggedInUserMock = useLoggedInUser as jest.Mock

jest.mock('next/router', () => ({
  useRouter: () => ({
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const mockStorageGetItem = AsyncStorage.getItem as jest.Mock
const mockStorageSetItem = AsyncStorage.setItem as jest.Mock
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockStorageRemoveItem = AsyncStorage.removeItem as jest.Mock
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
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
  mockStorageGetItem.mockImplementation((getKey) => {
    if (getKey === key) {
      return Promise.resolve(value)
    } else {
      return Promise.resolve(null)
    }
  })
  mockStorageSetItem.mockReturnValue(Promise.resolve())
}

const mockEnv = (loggedInState: LoggedInState, consentState?: ConsentState): void => {
  trackingEnabledMock.mockReturnValue(true)
  usePosthogCrossPlatformMock.mockReturnValue(posthogCrossPlatformMock)

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
    useLoggedInUserMock.mockReturnValue(mockedLoggedInState)
  } else {
    useLoggedInUserMock.mockReturnValue(loggedInState)
    if (consentState) mockAsyncStorage(consentState)
  }
}

// TODO consider using jest.useFakeTimers() / jest.runOnlyPendingTimers() / jest.runAllTimers()

const updateAuthenticatedUserRequest = (
  user: AuthenticatedUser
): [
  VariableMatcher<UpdateAuthenticatedUserInput>,
  MockedResponse<{ authenticatedUserV2: AuthenticatedUser }, UpdateAuthenticatedUserInput>
] => {
  const variableMatcher = jest.fn().mockReturnValue(true) as VariableMatcher<UpdateAuthenticatedUserInput>
  const mockedResponse = {
    request: {
      query: updateAuthenticatedUserV2Mutation,
    },
    variableMatcher: variableMatcher,
    result: {
      data: {
        authenticatedUserV2: {
          ...user,
        },
      },
    },
  }
  return [variableMatcher, mockedResponse]
}

describe('TrackingInitializer', () => {
  beforeEach(() => {
    // consentStateVar is a global variable, thereby shared state between tests and needs to be reset for reproducibility
    // using afterEach instead of beforeEach leads to timeouts of tests we couldn't explain ourselves
    consentStateVar(consentStateVarInitial)
  })

  describe('while user login state is still loading', () => {
    it.skip('does not initialize tracking on PostHog', () => {
      // TODO HOLI-7894
    })
  })
  describe('for a logged-out user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        mockEnv(loggedInStateLoggedOut, ConsentState.unknown)

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        mockEnv(loggedInStateLoggedOut, {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Denied,
        })

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        mockEnv(loggedInStateLoggedOut, {
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Given,
        })

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingProvider>
                <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
              </TrackingProvider>
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        mockEnv(loggedInStateLoggedOut, {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Given,
        })

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingProvider>
                <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
              </TrackingProvider>
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
  })
  describe('for a logged-in user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        mockEnv(loggedInStateLoggedIn())

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingProvider>
                <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
              </TrackingProvider>
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        const loggedInState = loggedInStateLoggedIn(true, false)
        mockEnv(loggedInState, {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Denied,
        })

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(loggedInState.user.id)
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        mockEnv(loggedInStateLoggedIn(true, false), {
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Given,
        })

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        const loggedInState = loggedInStateLoggedIn(true, true)
        mockEnv(loggedInState, {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Given,
        })

        const initialized = new Promise((resolve) => {
          render(
            <MockedProvider mocks={[]}>
              <TrackingInitializer enableTracking={true} onInitCompleted={resolve} />
            </MockedProvider>
          )
        })
        await act(async () => {
          await initialized
        })

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(loggedInState.user.id)
      })
    })
  })
  describe('when a logged-out user without consent gives analytics consent', () => {
    it('opts-in on PostHog without identifying the user', async () => {
      mockEnv(loggedInStateLoggedOut, {
        [TrackingPurpose.Analytics]: Consent.Unknown,
        [TrackingPurpose.Personalization]: Consent.Unknown,
      })

      let resolveInit, resolveUpdate
      const updateP = new Promise((resU) => {
        resolveUpdate = resU
      })
      const initP = new Promise((resI) => {
        resolveInit = resI
      })

      render(
        <MockedProvider mocks={[]}>
          <TrackingInitializer enableTracking={true} onInitCompleted={resolveInit} onUpdateCompleted={resolveUpdate} />
        </MockedProvider>
      )
      await act(async () => {
        await initP
      })

      expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
      expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

      await act(() =>
        updateConsentState({
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Denied,
        })
      )
      await act(async () => {
        await updateP
      })

      expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
      expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      expect(mockStorageSetItem).toHaveBeenCalledWith(
        'HOLI_TRACKING_CONSENT',
        '{"ANALYTICS":"given","PERSONALIZATION":"denied"}'
      )
    })
  })
  describe('when a logged-in user without consent gives analytics consent', () => {
    it('opts-in on PostHog and identifies the user', async () => {
      const loggedInState = loggedInStateLoggedIn()
      mockEnv(loggedInState, {
        [TrackingPurpose.Analytics]: Consent.Unknown,
        [TrackingPurpose.Personalization]: Consent.Unknown,
      })

      let resolveInit, resolveUpdate
      const updateP = new Promise((resU) => {
        resolveUpdate = resU
      })
      const initP = new Promise((resI) => {
        resolveInit = resI
      })

      const [variableMatcher, mockedResponse] = updateAuthenticatedUserRequest(loggedInState.user)
      render(
        <MockedProvider mocks={[mockedResponse]}>
          <TrackingInitializer enableTracking={true} onInitCompleted={resolveInit} onUpdateCompleted={resolveUpdate} />
        </MockedProvider>
      )
      await act(async () => {
        await initP
      })

      expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
      expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

      await act(() =>
        updateConsentState({
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Unknown,
        })
      )
      await act(async () => {
        await updateP
      })

      expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
      expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(loggedInState.user.id)
      expect(variableMatcher).toHaveBeenCalledWith({
        input: {
          trackingConsentAnalytics: true,
          trackingConsentPersonalization: undefined,
        },
      })
    })
  })
  describe('when a logged-in user with given consent logs out', () => {
    it.skip('clears local consent storage', () => {
      // TODO HOLI-8132 (if required as AC)
    })
  })
  describe('when a logged-out user gave analytics consent and logs in', () => {
    describe('and has an unknown consent state in the user profile', () => {
      it.skip('"migrates" the locally stored consent to the user profile', () => {
        // TODO HOLI-8173 (if required as AC)
      })
    })
    describe('and has previously denied consent stored in the user profile', () => {
      it.skip('opts-out of PostHog', async () => {
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
