import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { act, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import {
  exportedForTesting as loginStateTesting,
  setLoginStateLoggedIn,
  setLoginStateLoggedOut,
} from '@holi/core/auth/loginState'
import { type AuthenticatedUserV2Response, authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import {
  type UpdateAuthenticatedUserInput,
  type UpdateAuthenticatedUserV2Response,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import TrackingInitializer, {
  initialState,
  exportedForTesting as trackingInitializerTesting,
  updateConsentState,
} from '@holi/core/tracking/TrackingInitializer'
import { Consent, ConsentState, type PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

Object.defineProperty(window, 'navigator', {
  value: {},
  writable: true,
})

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
  flush: jest.fn(), // to return a promise, beforeEach further mocks the return value (as mocks are reset globally before each test)
} as PosthogCrossPlatform
const usePosthogCrossPlatformMock = usePosthogCrossPlatform as jest.Mock

jest.mock('next/router', () => ({
  useRouter: () => ({
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}))

const mockUser = (consentState: ConsentState): AuthenticatedUser => {
  return {
    ...getRandomUser(true),
    id: 'some-user-identity-id',
    trackingConsentAnalytics: Consent.toBooleanOrNull(consentState[TrackingPurpose.Analytics]),
    trackingConsentPersonalization: Consent.toBooleanOrNull(consentState[TrackingPurpose.Personalization]),
    isEmployee: faker.datatype.boolean(),
  } as AuthenticatedUser
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

const mockLocalStorage = (consentState?: ConsentState): void => {
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

const mockAuthenticatedUserResponse = (user: AuthenticatedUser): MockedResponse<AuthenticatedUserV2Response> => ({
  request: {
    query: authenticatedUserV2Query,
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

const mockUpdateAuthenticatedUserResponse = (user: AuthenticatedUser, consentState: ConsentState) => {
  const mockedResponse: MockedResponse<UpdateAuthenticatedUserV2Response, { input: UpdateAuthenticatedUserInput }> = {
    request: {
      query: updateAuthenticatedUserV2Mutation,
      variables: {
        input: {
          trackingConsentAnalytics: Consent.toBooleanOrNull(consentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBooleanOrNull(consentState[TrackingPurpose.Personalization]),
        },
      },
    },
    result: {
      data: {
        updateAuthenticatedUserV2: {
          ...user,
          trackingConsentAnalytics: Consent.toBooleanOrNull(consentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBooleanOrNull(consentState[TrackingPurpose.Personalization]),
          __typename: 'AuthenticatedUser',
        },
      },
    },
  }
  return mockedResponse
}

const mockEnv = () => {
  usePosthogCrossPlatformMock.mockReturnValue(posthogCrossPlatformMock)
}

const mockSession: OrySessionContext = {
  session_token: 'some-session-token',
  session: {
    id: 'some-kratos-id',
    identity: {
      id: 'some-user-identity-id',
      schema_id: 'some-schema-id',
      schema_url: 'some-schema-url',
      traits: undefined,
    },
  },
}

describe('TrackingInitializer', () => {
  beforeEach(() => {
    // consentStateVar is a global variable, thereby shared state between tests and needs to be reset for reproducibility
    // using afterEach instead of beforeEach leads to timeouts of tests we couldn't explain ourselves
    trackingInitializerTesting.initializerStateVar(initialState)
    loginStateTesting.resetLoggedInUserIdVar()
    // formatter makes crazy stuff, therefore these extra brackets
    // eslint-disable-next-line no-extra-semi
    ;(posthogCrossPlatformMock.flush as jest.Mock).mockReturnValue(Promise.resolve())
  })

  describe('while user login state is still loading', () => {
    it('does not initialize tracking on PostHog', async () => {
      render(
        <MockedProvider mocks={[]}>
          <TrackingInitializer enableTracking={true} />
        </MockedProvider>
      )

      expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
      expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
    })
    describe('and loading state transitions into logged out state', () => {
      it('must not delete locally stored consent state', async () => {
        mockEnv()
        mockLocalStorage({
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Denied,
        })
        const user = mockUser({
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Given,
        })

        const onUserLoggedOutCompleted = jest.fn()
        const component = (
          <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
            <TrackingInitializer enableTracking={true} onUserLoggedOutCompleted={onUserLoggedOutCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)

        await act(setLoginStateLoggedOut)
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(mockStorageRemoveItem).not.toHaveBeenCalled()
      })
    })
  })
  describe('for a logged-out user', () => {
    describe('given unknown consent', () => {
      it('does not opt in tracking on PostHog', async () => {
        const expectedConsentState = ConsentState.unknown
        mockEnv()
        mockLocalStorage(expectedConsentState)

        const onUserLoggedOutCompleted = jest.fn()
        const component = (
          <MockedProvider>
            <TrackingInitializer enableTracking={true} onUserLoggedOutCompleted={onUserLoggedOutCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)

        await act(setLoginStateLoggedOut)
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()

        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        const expectedConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Denied,
        }
        mockEnv()
        mockLocalStorage(expectedConsentState)

        const onUserLoggedOutCompleted = jest.fn()
        const component = (
          <MockedProvider>
            <TrackingInitializer enableTracking={true} onUserLoggedOutCompleted={onUserLoggedOutCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(setLoginStateLoggedOut)
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        const expectedConsentState = {
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Given,
        }
        mockEnv()
        mockLocalStorage(expectedConsentState)

        const onUserLoggedOutCompleted = jest.fn()
        const component = (
          <MockedProvider>
            <TrackingInitializer enableTracking={true} onUserLoggedOutCompleted={onUserLoggedOutCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(setLoginStateLoggedOut)
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        const expectedConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Given,
        }
        mockEnv()
        mockLocalStorage(expectedConsentState)

        const onUserLoggedOutCompleted = jest.fn()
        const component = (
          <MockedProvider>
            <TrackingInitializer enableTracking={true} onUserLoggedOutCompleted={onUserLoggedOutCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(setLoginStateLoggedOut)
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
    })
  })
  describe('for a logged-in user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        const expectedConsentState = ConsentState.unknown
        mockEnv()
        const user = mockUser(expectedConsentState)

        const onUserLoggedInCompleted = jest.fn()
        const component = (
          <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
            <TrackingInitializer enableTracking={true} onUserLoggedInCompleted={onUserLoggedInCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(async () => await setLoginStateLoggedIn(mockSession))
        rerender(component)
        await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        const expectedConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Denied,
        }
        mockEnv()
        const user = mockUser(expectedConsentState)

        const onUserLoggedInCompleted = jest.fn()
        const component = (
          <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
            <TrackingInitializer enableTracking={true} onUserLoggedInCompleted={onUserLoggedInCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(async () => await setLoginStateLoggedIn(mockSession))
        rerender(component)
        await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(user.id, {
          isEmployee: user.isEmployee,
          trackingConsentAnalytics: Consent.toBooleanOrNull(expectedConsentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBooleanOrNull(
            expectedConsentState[TrackingPurpose.Personalization]
          ),
        })
        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', async () => {
        const expectedConsentState = {
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Given,
        }
        mockEnv()
        const user = mockUser(expectedConsentState)

        const onUserLoggedInCompleted = jest.fn()
        const component = (
          <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
            <TrackingInitializer enableTracking={true} onUserLoggedInCompleted={onUserLoggedInCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(async () => await setLoginStateLoggedIn(mockSession))
        rerender(component)
        await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        const expectedConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Given,
        }
        mockEnv()
        const user = mockUser(expectedConsentState)

        const onUserLoggedInCompleted = jest.fn()
        const component = (
          <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
            <TrackingInitializer enableTracking={true} onUserLoggedInCompleted={onUserLoggedInCompleted} />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(async () => await setLoginStateLoggedIn(mockSession))
        rerender(component)
        await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(user.id, {
          isEmployee: user.isEmployee,
          trackingConsentAnalytics: Consent.toBooleanOrNull(expectedConsentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBooleanOrNull(
            expectedConsentState[TrackingPurpose.Personalization]
          ),
        })
        const [consentState] = trackingInitializerTesting.consentStateVar()
        expect(consentState).toEqual(expectedConsentState)
      })
      describe('when the user retracts personalization consent', () => {
        it('updates consent state on PostHogs person properties', async () => {
          const consentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Given,
          }
          const updatedConsentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Denied,
          }
          mockEnv()
          const user = mockUser(consentState)

          const onUserLoggedInCompleted = jest.fn()
          const onUpdateCompleted = jest.fn()
          const component = (
            <MockedProvider
              mocks={[
                mockAuthenticatedUserResponse(user),
                mockUpdateAuthenticatedUserResponse(user, updatedConsentState),
              ]}
            >
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUpdateCompleted={onUpdateCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)

          posthogCrossPlatformMock.reset()
          await act(() => {
            updateConsentState(updatedConsentState)
          })
          await waitFor(() => expect(onUpdateCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.updatePersonProperties).toHaveBeenCalledWith({
            trackingConsentAnalytics: true,
            trackingConsentPersonalization: false,
          })
          expect(posthogCrossPlatformMock.flush).toHaveBeenCalledTimes(1)
        })
      })
      describe('when the user retracts analytics consent', () => {
        it('updates consent state on PostHogs person properties', async () => {
          const consentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Given,
          }
          const updatedConsentState = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Given,
          }
          mockEnv()
          const user = mockUser(consentState)

          const onUserLoggedInCompleted = jest.fn()
          const onUpdateCompleted = jest.fn()
          const component = (
            <MockedProvider
              mocks={[
                mockAuthenticatedUserResponse(user),
                mockUpdateAuthenticatedUserResponse(user, updatedConsentState),
              ]}
            >
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUpdateCompleted={onUpdateCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)

          posthogCrossPlatformMock.reset()

          await act(() => {
            updateConsentState(updatedConsentState)
          })
          await waitFor(() => expect(onUpdateCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.updatePersonProperties).toHaveBeenCalledWith({
            trackingConsentAnalytics: false,
            trackingConsentPersonalization: true,
          })
          expect(posthogCrossPlatformMock.flush).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
  describe('given a logged-in user with denied analytics consent', () => {
    describe('when user gives analytics consent', () => {
      it('opts-in on PostHog and identifies the user', async () => {
        mockEnv()
        const initialConsentState: ConsentState = {
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Denied,
        }
        const updatedConsentState: ConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Given,
        }
        const user = mockUser(initialConsentState)

        const onUserLoggedInCompleted = jest.fn()
        const onUpdateCompleted = jest.fn()
        const component = (
          <MockedProvider
            mocks={[
              mockAuthenticatedUserResponse(user),
              mockUpdateAuthenticatedUserResponse(user, updatedConsentState),
            ]}
          >
            <TrackingInitializer
              enableTracking={true}
              onUserLoggedInCompleted={onUserLoggedInCompleted}
              onUpdateCompleted={onUpdateCompleted}
            />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(async () => await setLoginStateLoggedIn(mockSession))
        rerender(component)
        await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
        expect(consentStateBefore).toEqual(initialConsentState)

        await act(() => updateConsentState(updatedConsentState))
        await waitFor(() => expect(onUpdateCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(user.id, {
          isEmployee: user.isEmployee,
          trackingConsentAnalytics: Consent.toBooleanOrNull(updatedConsentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBooleanOrNull(updatedConsentState[TrackingPurpose.Personalization]),
        })
        const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
        expect(consentStateAfter).toEqual(updatedConsentState)
      })
    })
  })
  describe('given a logged-in user with given analytics consent', () => {
    describe('when user logs out', () => {
      it('clears local consent storage and resets posthog tracking', async () => {
        const loggedInConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Unknown,
        }
        mockEnv()
        mockLocalStorage()
        const user = mockUser(loggedInConsentState)

        const onUserLoggedInCompleted = jest.fn()
        const onUserLoggedOutCompleted = jest.fn()
        const component = (
          <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
            <TrackingInitializer
              enableTracking={true}
              onUserLoggedInCompleted={onUserLoggedInCompleted}
              onUserLoggedOutCompleted={onUserLoggedOutCompleted}
            />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(async () => await setLoginStateLoggedIn(mockSession))
        rerender(component)
        await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)
        const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
        expect(consentStateBefore).toEqual(loggedInConsentState)

        await act(setLoginStateLoggedOut)
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(mockStorageRemoveItem).toHaveBeenCalledWith('HOLI_TRACKING_CONSENT')
        expect(posthogCrossPlatformMock.reset).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)
        const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
        expect(consentStateAfter).toEqual(ConsentState.unknown)
      })
    })
  })
  describe('given a logged-out user with given analytics consent', () => {
    describe('when user logs in', () => {
      describe('with unknown analytics consent in user profile', () => {
        it('"migrates" the locally stored consent to the user profile', async () => {
          mockEnv()
          const localStorageConsentState: ConsentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Denied,
          }
          mockLocalStorage(localStorageConsentState)
          const user = mockUser(ConsentState.unknown)
          const expectedMigratedConsentState: ConsentState = localStorageConsentState

          const onUserLoggedOutCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider
              mocks={[
                mockAuthenticatedUserResponse(user),
                mockUpdateAuthenticatedUserResponse(user, expectedMigratedConsentState),
              ]}
            >
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(setLoginStateLoggedOut)
          await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
          expect(consentStateBefore).toEqual(localStorageConsentState)

          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(2)
          expect(posthogCrossPlatformMock.identify).toHaveBeenCalledWith(user.id, {
            isEmployee: user.isEmployee,
            trackingConsentAnalytics: Consent.toBooleanOrNull(expectedMigratedConsentState[TrackingPurpose.Analytics]),
            trackingConsentPersonalization: Consent.toBooleanOrNull(
              expectedMigratedConsentState[TrackingPurpose.Personalization]
            ),
          })
          const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
          expect(consentStateAfter).toEqual(localStorageConsentState)
        })
      })
      describe('with known analytics consent in the user profile', () => {
        it('does not "migrate" the locally stored consent to the user profile', async () => {
          const localStorageConsentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Given,
          }
          const userProfileConsentState = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Denied,
          }
          mockEnv()
          mockLocalStorage(localStorageConsentState)
          const user = mockUser(userProfileConsentState)

          const onUserLoggedOutCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(setLoginStateLoggedOut)
          await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.optOut).not.toHaveBeenCalled()
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
          expect(consentStateBefore).toEqual(localStorageConsentState)

          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
          expect(consentStateAfter).toEqual(userProfileConsentState)
        })
      })
      describe('with denied analytics consent in user profile', () => {
        it('opts-out of PostHog', async () => {
          const localStorageConsentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          const userProfileConsentState = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockEnv()
          mockLocalStorage(localStorageConsentState)
          const user = mockUser(userProfileConsentState)

          const onUserLoggedOutCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(setLoginStateLoggedOut)
          rerender(component)
          await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
          expect(consentStateBefore).toEqual(localStorageConsentState)

          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
          expect(consentStateAfter).toEqual(userProfileConsentState)
        })
      })
      describe('with given analytics consent in user profile', () => {
        it('stays opted-in to posthog', async () => {
          const localStorageConsentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          const userProfileConsentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Denied,
          }
          mockEnv()
          mockLocalStorage(localStorageConsentState)
          const user = mockUser(userProfileConsentState)

          const onUserLoggedOutCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(setLoginStateLoggedOut)
          rerender(component)
          await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
          expect(consentStateBefore).toEqual(localStorageConsentState)

          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(0)
          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(2)
          expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)
          const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
          expect(consentStateAfter).toEqual(userProfileConsentState)
        })
      })
    })
  })
  describe('given a logged-out user with denied analytics consent', () => {
    describe('when user gives analytics consent', () => {
      it('opts-in on PostHog without identifying the user', async () => {
        const localStorageConsentState = {
          [TrackingPurpose.Analytics]: Consent.Denied,
          [TrackingPurpose.Personalization]: Consent.Unknown,
        }
        mockEnv()
        mockLocalStorage(localStorageConsentState)

        const onUserLoggedOutCompleted = jest.fn()
        const onUpdateCompleted = jest.fn()
        const component = (
          <MockedProvider>
            <TrackingInitializer
              enableTracking={true}
              onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              onUpdateCompleted={onUpdateCompleted}
            />
          </MockedProvider>
        )
        const { rerender } = render(component)
        await act(setLoginStateLoggedOut)
        rerender(component)
        await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
        expect(consentStateBefore).toEqual(localStorageConsentState)

        const updatedConsentState = {
          [TrackingPurpose.Analytics]: Consent.Given,
          [TrackingPurpose.Personalization]: Consent.Denied,
        }
        await act(() => {
          updateConsentState(updatedConsentState)
        })
        await waitFor(() => expect(onUpdateCompleted).toHaveBeenCalledTimes(1))

        expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
        expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
        expect(mockStorageSetItem).toHaveBeenCalledWith(
          'HOLI_TRACKING_CONSENT',
          '{"ANALYTICS":"given","PERSONALIZATION":"denied"}'
        )
        const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
        expect(consentStateAfter).toEqual(updatedConsentState)
      })
    })
    describe('when user logs in', () => {
      describe('with unknown analytics consent in user profile', () => {
        it('"migrates" the locally stored consent to the user profile', async () => {
          mockEnv()
          const localStorageConsentState = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockLocalStorage(localStorageConsentState)
          const user = mockUser(ConsentState.unknown)
          const expectedUpdatedConsentState = localStorageConsentState

          const onUserLoggedOutCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider
              mocks={[
                mockAuthenticatedUserResponse(user),
                mockUpdateAuthenticatedUserResponse(user, expectedUpdatedConsentState),
              ]}
            >
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(setLoginStateLoggedOut)
          rerender(component)
          await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
          expect(consentStateBefore).toEqual(localStorageConsentState)

          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
          expect(consentStateAfter).toEqual(localStorageConsentState)
        })
      })
      describe('with given analytics consent in user profile', () => {
        it('opts-in on PostHog and identifies the user', async () => {
          const localStorageConsentState = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          const userProfileConsentState = {
            [TrackingPurpose.Analytics]: Consent.Given,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          mockEnv()
          mockLocalStorage(localStorageConsentState)
          const user = mockUser(userProfileConsentState)

          const onUserLoggedOutCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(setLoginStateLoggedOut)
          rerender(component)
          await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
          expect(consentStateBefore).toEqual(localStorageConsentState)

          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).toHaveBeenCalledTimes(1)
          const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
          expect(consentStateAfter).toEqual(userProfileConsentState)
        })
      })
      describe('with denied analytics consent in user profile', () => {
        it('does not opt-in to posthog', async () => {
          const localStorageConsentState = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Unknown,
          }
          const userProfileConsentState = {
            [TrackingPurpose.Analytics]: Consent.Denied,
            [TrackingPurpose.Personalization]: Consent.Denied,
          }
          mockEnv()
          mockLocalStorage(localStorageConsentState)
          const user = mockUser(userProfileConsentState)

          const onUserLoggedOutCompleted = jest.fn()
          const onUserLoggedInCompleted = jest.fn()
          const component = (
            <MockedProvider mocks={[mockAuthenticatedUserResponse(user)]}>
              <TrackingInitializer
                enableTracking={true}
                onUserLoggedInCompleted={onUserLoggedInCompleted}
                onUserLoggedOutCompleted={onUserLoggedOutCompleted}
              />
            </MockedProvider>
          )
          const { rerender } = render(component)
          await act(setLoginStateLoggedOut)
          rerender(component)
          await waitFor(() => expect(onUserLoggedOutCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optOut).toHaveBeenCalledTimes(1)
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateBefore] = trackingInitializerTesting.consentStateVar()
          expect(consentStateBefore).toEqual(localStorageConsentState)

          await act(async () => await setLoginStateLoggedIn(mockSession))
          rerender(component)
          await waitFor(() => expect(onUserLoggedInCompleted).toHaveBeenCalledTimes(1))

          expect(posthogCrossPlatformMock.optIn).not.toHaveBeenCalled()
          expect(posthogCrossPlatformMock.identify).not.toHaveBeenCalled()
          const [consentStateAfter] = trackingInitializerTesting.consentStateVar()
          expect(consentStateAfter).toEqual(userProfileConsentState)
        })
      })
    })
  })
})
