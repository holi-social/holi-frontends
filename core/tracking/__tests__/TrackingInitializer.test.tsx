import { render } from '@testing-library/react-native'
import React from 'react'

import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import {
  LoggedInUser,
  LoggedInUserLoading,
  LoggedOut,
  useLoggedInUser,
} from '@holi/core/screens/userprofile/useLoggedInUser'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

jest.mock('@holi/core/auth/helpers/useAuth')

const useLoggedInUserMock = jest.mocked(useLoggedInUser)

const loading: LoggedInUserLoading = {
  state: 'loading',
  isLoading: true,
  isLoggedIn: false,
  isLoggedOut: false,
  user: undefined,
  refetch: () => Promise.resolve(),
}

const loggedOut: LoggedOut = {
  state: 'loggedOut',
  isLoading: false,
  isLoggedIn: false,
  isLoggedOut: true,
  user: undefined,
  refetch: () => Promise.resolve(),
}

const loggedIn = (consentAnalytics: boolean, consentPersonalization: boolean): LoggedInUser => ({
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

describe('TrackingInitializer', () => {
  describe('for a logged-out user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', () => {
        pending('TODO')
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog without identifying the user', () => {
        pending('TODO')
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', () => {
        pending('TODO')
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog without identifying the user', () => {
        pending('TODO')
      })
    })
  })
  describe('for a logged-in user', () => {
    describe('given unknown consent', () => {
      it('does not initialize tracking on PostHog', () => {
        pending('TODO')
      })
    })
    describe('given only analytics consent', () => {
      it('opts-in on PostHog and identifies the user', () => {
        pending('TODO')
      })
    })
    describe('given only personalization consent', () => {
      it('does not initialize tracking on PostHog', () => {
        pending('TODO')
      })
    })
    describe('given analytics + personalization consent', () => {
      it('opts-in on PostHog and identifies the user', () => {
        pending('TODO')
      })
    })
  })
  describe('when a logged-out user without consent gives analytics consent', () => {
    it('opts-in on PostHog without identifying the user', () => {
      pending('TODO')
    })
  })
  describe('when a logged-in user without consent gives analytics consent', () => {
    it('opts-in on PostHog and identifies the user', () => {
      pending('TODO')
    })
  })
  describe('when a logged-in user with given consent logs out', () => {
    it('clears local consent storage', () => {
      pending('TODO')
    })
  })
  describe('when a logged-out user gave analytics consent', () => {
    describe('and has an unknown consent state in the user profile', () => {
      it('"migrates" the locally stored consent to the user profile', () => {
        pending('TODO')
      })
    })
    describe('and has previously denied consent stored in the user profile', () => {
      it('opts-out of PostHog', () => {
        pending('TODO')
      })
    })
  })
  describe('when a logged-out user denied analytics consent', () => {
    describe('and then logs in with a previously given consent stored on user profile', () => {
      it('opts-in on PostHog and identifies the user', () => {
        pending('TODO')
      })
    })
  })
})
