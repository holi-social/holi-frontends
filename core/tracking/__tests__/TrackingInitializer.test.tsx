import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { jest } from '@jest/globals'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import {
  AuthenticatedUserV2Response,
  AuthenticatedUserV2Variables,
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserV2Response,
  authenticatedUserV2Query,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import {
  LoggedInState,
  LoggedInUser,
  LoggedInUserLoading,
  LoggedOut,
  useLoggedInUser,
} from '@holi/core/screens/userprofile/useLoggedInUser'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import TrackingInitializer, {
  consentStateVar,
  consentStateVarInitial,
  updateConsentState,
  userLoggedIn,
  userLoggedOut,
} from '@holi/core/tracking/TrackingInitializer'
import { trackingEnabled } from '@holi/core/tracking/config'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'
import TrackingProvider from '@holi/web/providers/TrackingProvider'

Object.defineProperty(window, 'navigator', {
  value: {},
  writable: true,
})

jest.mock('@holi/core/tracking/config')
const trackingEnabledMock = trackingEnabled as jest.Mock

jest.mock('@holi/core/tracking/PosthogCrossPlatform')
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

const TEST_USER_ID = '123'

const loggedInStateLoggedIn = (consentState?: ConsentState): LoggedInUser => {
  const consentAnalytics = consentState ? consentState[TrackingPurpose.Analytics] == Consent.Given : undefined
  const consentPersonalization = consentState
    ? consentState[TrackingPurpose.Personalization] == Consent.Given
    : undefined
  return {
    state: 'loggedIn',
    isLoading: false,
    isLoggedIn: true,
    isLoggedOut: false,
    user: {
      ...getRandomUser(true),
      id: TEST_USER_ID,
      trackingConsentAnalytics: consentAnalytics,
      trackingConsentPersonalization: consentPersonalization,
    } as AuthenticatedUser,
    refetch: () => Promise.resolve(),
  }
}

const mockStorageGetItem = AsyncStorage.getItem as jest.Mock
const mockStorageSetItem = AsyncStorage.setItem as jest.Mock
const mockStorageRemoveItem = AsyncStorage.removeItem as jest.Mock
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }
})

const mockAsyncStorage = (consentState?: ConsentState): void => {
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
  const value = consentState
    ? `{"ANALYTICS":"${consentToString(consentState[TrackingPurpose.Analytics])}","PERSONALIZATION":"${consentToString(
        consentState[TrackingPurpose.Personalization]
      )}"}`
    : null
  mockStorageGetItem.mockImplementation((getKey) => {
    if (getKey === key) {
      return Promise.resolve(value)
    } else {
      return Promise.reject(Error('unexpected key'))
    }
  })
  mockStorageSetItem.mockReturnValue(Promise.resolve())
  mockStorageRemoveItem.mockImplementation((removeKey) => {
    if (removeKey === key) {
      return Promise.resolve(value)
    } else {
      return Promise.reject(Error('unexpected key'))
    }
  })
}

const mockedAuthenticatedUserResponse = (
  user: AuthenticatedUser
): MockedResponse<AuthenticatedUserV2Response, AuthenticatedUserV2Variables> => ({
  request: {
    query: authenticatedUserV2Query,
    variables: {
      userId: TEST_USER_ID,
    },
  },
  result: {
    data: {
      authenticatedUserV2: {
        ...user,
        __typename: 'AuthenticatedUser', // needs to be added, otherwise mocking a query that uses fragments won't work
      },
    },
  },
})

const mockEnv = (
  loggedInState: LoggedInState,
  consentState?: { localStorage?: ConsentState; profile?: ConsentState }
): MockedResponse<AuthenticatedUserV2Response, AuthenticatedUserV2Variables>[] => {
  trackingEnabledMock.mockReturnValue(true)
  usePosthogCrossPlatformMock.mockReturnValue(posthogCrossPlatformMock)
  mockAsyncStorage(consentState?.localStorage)

  if (loggedInState.isLoggedIn) {
    const consentAnalytics = consentState?.profile
      ? consentState?.profile[TrackingPurpose.Analytics] == Consent.Given
      : undefined
    const consentPersonalization = consentState?.profile
      ? consentState?.profile[TrackingPurpose.Personalization] == Consent.Given
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
    return [mockedAuthenticatedUserResponse(mockedLoggedInState.user)]
  } else {
    useLoggedInUserMock.mockReturnValue(loggedInState)
    return []
  }
}

describe('TrackingInitializer', () => {
  beforeEach(() => {
    // consentStateVar is a global variable, thereby shared state between tests and needs to be reset for reproducibility
    // using afterEach instead of beforeEach leads to timeouts of tests we couldn't explain ourselves
    consentStateVar(consentStateVarInitial)
  })

  describe('while user login state is still loading', () => {
    it('does not initialize tracking on PostHog', async () => {
      const apolloMocks = mockEnv(loggedInStateLoading)

      render(
        <MockedProvider mocks={apolloMocks}>
          <TrackingInitializer enableTracking={true} />
        </MockedProvider>
      )

      expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
      expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
    })
  })
  describe('for a logged-out user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        const apolloMocks = mockEnv(loggedInStateLoggedOut)

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        const apolloMocks = mockEnv(loggedInStateLoggedOut, {
          localStorage: {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Denied,
          },
        })

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        const apolloMocks = mockEnv(loggedInStateLoggedOut, {
          localStorage: {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Given,
          },
        })

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingProvider>
              <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
            </TrackingProvider>
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        const apolloMocks = mockEnv(loggedInStateLoggedOut, {
          localStorage: {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Given,
          },
        })

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingProvider>
              <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
            </TrackingProvider>
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
  })
  describe('for a logged-in user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        const apolloMocks = mockEnv(loggedInStateLoggedIn())

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingProvider>
              <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
            </TrackingProvider>
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        const profileConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Denied,
        }
        const loggedInState = loggedInStateLoggedIn(profileConsentState)
        const apolloMocks = mockEnv(loggedInState, { profile: profileConsentState })

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(loggedInState.user.id)
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        const profileConsentState = {
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Given,
        }
        const apolloMocks = mockEnv(loggedInStateLoggedIn(profileConsentState), { profile: profileConsentState })

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        const profileConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Given,
        }
        const loggedInState = loggedInStateLoggedIn(profileConsentState)
        const apolloMocks = mockEnv(loggedInState, { profile: profileConsentState })

        const onInitCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingInitializer enableTracking={true} onInitCompleted={onInitCompleted} />
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(loggedInState.user.id)
      })
    })
  })
  describe('given a logged-in user with denied analytics consent', () => {
    describe('when user gives analytics consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        const loggedInState = loggedInStateLoggedIn()
        const apolloMocks = mockEnv(loggedInState, {
          profile: {
            [TrackingPurpose.Analytics]: Consent.Unknown,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          },
        })

        const mockedResponse: MockedResponse<
          UpdateAuthenticatedUserV2Response,
          { input: UpdateAuthenticatedUserInput }
        > = {
          request: {
            query: updateAuthenticatedUserV2Mutation,
            variables: {
              input: {
                trackingConsentAnalytics: true,
                trackingConsentPersonalization: false,
              },
            },
          },
          result: {
            data: {
              updateAuthenticatedUserV2: {
                ...loggedInState.user,
                trackingConsentAnalytics: true,
                trackingConsentPersonalization: false,
                __typename: 'AuthenticatedUser',
              },
            },
          },
        }

        const onInitCompleted = jest.fn()
        const onUpdateCompleted = jest.fn()

        render(
          <MockedProvider mocks={[...apolloMocks, mockedResponse]}>
            <TrackingInitializer
              enableTracking={true}
              onInitCompleted={onInitCompleted}
              onUpdateCompleted={onUpdateCompleted}
            />
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

        await act(() =>
          updateConsentState({
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Denied,
          })
        )
        await waitFor(() => expect(onUpdateCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(loggedInState.user.id)
        // TODO HOLI-8209 validate that user profile on backend was updated. this requires the update of @apollo/client
        // TODO in order to be able to use variableMatcher in <MockProvider>. without it, it is not possible to use
        // TODO assertions on if the query was made to the backend.
      })
    })
  })
  describe('given a logged-in user with given analytics consent', () => {
    describe('when user logs out', () => {
      it('clears local consent storage and resets posthog tracking', async () => {
        const profileConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Unknown,
        }
        const apolloMocks = mockEnv(loggedInStateLoggedIn(profileConsentState), {
          profile: profileConsentState,
        })

        const onInitCompleted = jest.fn()
        const onUserLoggedInCompleted = jest.fn()
        const onUserLoggedOutCompleted = jest.fn()
        const component = (
          <MockedProvider mocks={apolloMocks}>
            <TrackingInitializer
              enableTracking={true}
              onInitCompleted={onInitCompleted}
              onUserLoggedInCompleted={onUserLoggedInCompleted}
              onUserLoggedOutCompleted={onUserLoggedOutCompleted}
            />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)

        useLoggedInUserMock.mockClear()
        useLoggedInUserMock.mockReturnValue(loggedInStateLoggedOut)
        await act(() => {
          // this is normally called by useAuth.setUserLoggedIn / useAuth.setUserLoggedOut
          userLoggedOut()
        })
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(mockStorageRemoveItem).toHaveBeenCalledWith('HOLI_TRACKING_CONSENT')
        expect(posthogCrossPlatformMock.reset).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)
      })
    })
  })
  describe('given a logged-out user with given analytics consent', () => {
    describe('when user logs in', () => {
      describe('with unknown analytics consent in user profile', () => {
        it.skip('"migrates" the locally stored consent to the user profile', () => {
          // TODO HOLI-8173 (if required as AC)
        })
      })
      describe('with known analytics consent in the user profile', () => {
        it.skip('does not "migrate" the locally stored consent to the user profile', () => {
          // TODO HOLI-8173 (if required as AC)
        })
      })
      describe('with denied analytics consent in user profile', () => {
        it('opts-out of PostHog', async () => {
          const consentStateProfile = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockEnv(loggedInStateLoggedOut, {
            localStorage: {
              [TrackingPurpose.Analytics]: Consent.Given,
              [TrackingPurpose.Personalization]: Consent.Unknown,
            },
            profile: consentStateProfile,
          })

          const loggedInUser = loggedInStateLoggedIn(consentStateProfile)
          const apolloMocks = [mockedAuthenticatedUserResponse(loggedInUser.user)]

          const onInitCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={apolloMocks}>
              <TrackingInitializer
                enableTracking={true}
                onInitCompleted={onInitCompleted}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

          useLoggedInUserMock.mockClear()
          useLoggedInUserMock.mockReturnValue(loggedInUser)
          await act(() => {
            // this is normally called by useAuth.setUserLoggedIn / useAuth.setUserLoggedOut
            userLoggedIn(loggedInUser.user.id)
          })
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        })
      })
      describe('with given analytics consent in user profile', () => {
        it('stays opted-in to posthog', async () => {
          const consentStateProfile = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockEnv(loggedInStateLoggedOut, {
            localStorage: {
              [TrackingPurpose.Analytics]: Consent.Given,
              [TrackingPurpose.Personalization]: Consent.Unknown,
            },
            profile: consentStateProfile,
          })

          const loggedInUser = loggedInStateLoggedIn(consentStateProfile)
          const apolloMocks = [mockedAuthenticatedUserResponse(loggedInUser.user)]

          const onInitCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={apolloMocks}>
              <TrackingInitializer
                enableTracking={true}
                onInitCompleted={onInitCompleted}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

          useLoggedInUserMock.mockClear()
          useLoggedInUserMock.mockReturnValue(loggedInUser)
          await act(() => {
            // this is normally called by useAuth.setUserLoggedIn / useAuth.setUserLoggedOut
            userLoggedIn(loggedInUser.user.id)
          })
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(0)
          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(2)
          expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
  describe('given a logged-out user with denied analytics consent', () => {
    describe('when user gives analytics consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        const apolloMocks = mockEnv(loggedInStateLoggedOut, {
          localStorage: {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          },
        })

        const onInitCompleted = jest.fn()
        const onUpdateCompleted = jest.fn()
        render(
          <MockedProvider mocks={apolloMocks}>
            <TrackingInitializer
              enableTracking={true}
              onInitCompleted={onInitCompleted}
              onUpdateCompleted={onUpdateCompleted}
            />
          </MockedProvider>
        )
        await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

        await act(() =>
          updateConsentState({
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Denied,
          })
        )
        await waitFor(() => expect(onUpdateCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        expect(mockStorageSetItem).toHaveBeenCalledWith(
          'HOLI_TRACKING_CONSENT',
          '{"ANALYTICS":"given","PERSONALIZATION":"denied"}'
        )
      })
    })
    describe('when user logs in', () => {
      describe('with unknown analytics consent in user profile', () => {
        it('does not opt-in to posthog', async () => {
          const consentStateProfile = {
            [TrackingPurpose.Analytics]: Consent.Unknown,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockEnv(loggedInStateLoggedOut, {
            localStorage: {
              [TrackingPurpose.Analytics]: Consent.Denied,
              [TrackingPurpose.Personalization]: Consent.Unknown,
            },
            profile: consentStateProfile,
          })

          const loggedInUser = loggedInStateLoggedIn(consentStateProfile)
          const apolloMocks = [mockedAuthenticatedUserResponse(loggedInUser.user)]

          const onInitCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={apolloMocks}>
              <TrackingInitializer
                enableTracking={true}
                onInitCompleted={onInitCompleted}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

          useLoggedInUserMock.mockClear()
          useLoggedInUserMock.mockReturnValue(loggedInUser)
          await act(() => {
            // this is normally called by useAuth.setUserLoggedIn / useAuth.setUserLoggedOut
            userLoggedIn(loggedInUser.user.id)
          })
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        })
      })
      describe('with given analytics consent in user profile', () => {
        it('opts-in on PostHog and identifies the user', async () => {
          const consentStateProfile = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockEnv(loggedInStateLoggedOut, {
            localStorage: {
              [TrackingPurpose.Analytics]: Consent.Denied,
              [TrackingPurpose.Personalization]: Consent.Unknown,
            },
            profile: consentStateProfile,
          })

          const loggedInUser = loggedInStateLoggedIn(consentStateProfile)
          const apolloMocks = [mockedAuthenticatedUserResponse(loggedInUser.user)]

          const onInitCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={apolloMocks}>
              <TrackingInitializer
                enableTracking={true}
                onInitCompleted={onInitCompleted}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

          useLoggedInUserMock.mockClear()
          useLoggedInUserMock.mockReturnValue(loggedInUser)
          await act(() => {
            // this is normally called by useAuth.setUserLoggedIn / useAuth.setUserLoggedOut
            userLoggedIn(loggedInUser.user.id)
          })
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)
        })
      })
      describe('with denied analytics consent in user profile', () => {
        it('does not opt-in to posthog', async () => {
          const consentStateProfile = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockEnv(loggedInStateLoggedOut, {
            localStorage: {
              [TrackingPurpose.Analytics]: Consent.Denied,
              [TrackingPurpose.Personalization]: Consent.Unknown,
            },
            profile: consentStateProfile,
          })

          const loggedInUser = loggedInStateLoggedIn(consentStateProfile)
          const apolloMocks = [mockedAuthenticatedUserResponse(loggedInUser.user)]

          const onInitCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={apolloMocks}>
              <TrackingInitializer
                enableTracking={true}
                onInitCompleted={onInitCompleted}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await waitFor(() => expect(onInitCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

          useLoggedInUserMock.mockClear()
          useLoggedInUserMock.mockReturnValue(loggedInUser)
          await act(() => {
            // this is normally called by useAuth.setUserLoggedIn / useAuth.setUserLoggedOut
            userLoggedIn(loggedInUser.user.id)
          })
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        })
      })
    })
  })
})
