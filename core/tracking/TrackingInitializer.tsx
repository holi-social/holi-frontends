import { ApolloClient, makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import React, { PropsWithChildren, memo, useEffect, useMemo, useRef, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  updateAuthenticatedUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import { LoggedInState, useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { consentStore } from '@holi/core/tracking/consent_store'
import { usePosthogCrossPlatform } from '@holi/core/tracking/posthog_cross_platform'
import { Consent, ConsentState, PosthogCrossPlatform, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

const consentStateVar = makeVar<{ onLoad: boolean; state: ConsentState }>({
  onLoad: true,
  state: ConsentState.unknown,
})

export const useConsentState = () => {
  const initialLoad = () => {
    tracking.loadConsent(loggedInState).then((newState) => consentStateVar({ onLoad: true, state: newState }))
  }
  const update = () => {
    // ...
  }
  return {
    initialLoad,
    update,
  }
}

// TODO ???
export const updateConsentState = (consentState: ConsentState) => {
  consentStateVar({ onLoad: false, state: consentState })
}

class Tracking {
  constructor(private posthog: PosthogCrossPlatform, private apollo: ApolloClient<object>) {}

  public optIn = async () => {
    if (!this.posthog.optedIn()) return await this.posthog.optIn()
    else return Promise.resolve()
  }

  public optOut = async () => {
    if (this.posthog.optedIn()) return await this.posthog.optOut()
    else return Promise.resolve()
  }

  public initWithLoggedInUser = async (user: AuthenticatedUser): Promise<void> => {
    logger.debug('TrackingInitializer.userLoggedIn', 'user=%s', user)
    switch (Consent.fromBoolean(user.trackingConsentAnalytics)) {
      case Consent.Given:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent given, opting in on posthog client')
        await this.optIn()
        logger.debug('TrackingInitializer.userLoggedIn', 'identifying user on posthog client')
        return this.posthog.identify(user.id)
      case Consent.Unknown || Consent.Denied:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent NOT given, opting out on posthog client')
        return await this.optOut()
    }
  }

  public initWithLoggedOutUser = async (): Promise<void> => {
    switch ((await consentStore.load())[TrackingPurpose.Analytics]) {
      case Consent.Given:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent given, opting in on posthog client')
        return await this.optIn()
      case Consent.Unknown || Consent.Denied:
        logger.debug('TrackingInitializer.userLoggedIn', 'analytics consent NOT given, opting out on posthog client')
        return await this.optOut()
    }
  }

  // TODO call this after user logged out
  public clearConsentAfterUserLoggedOut = async (): Promise<void> => {
    const errorContext = { location: 'useTracking.userLoggedOut' }
    return consentStore
      .clear()
      .then(() => logger.debug('TrackingInitializer.userLoggedOut', 'cleared consentStore'))
      .catch((error) => logError(error, 'Failed to clear tracking consent', errorContext))
      .finally(() => this.posthog.reset())
      .then(() => logger.debug('TrackingInitializer.userLoggedOut', 'posthog reset'))
      .catch((error) => logError(error, 'Failed to reset Posthog client', errorContext))
  }

  public loadConsent = (loggedInState: LoggedInState): Promise<ConsentState> => {}

  // TODO make this available to be called by frontend code
  // TODO how to act on updated consent store / user profile?
  public storeConsent = (loggedInState: LoggedInState, consentState: ConsentState): Promise<void> => {
    const errorContext = { location: 'TrackingInitializer.updateConsent' }
    const store = !loggedInState.isLoggedIn
      ? consentStore.store(consentState)
      : this.updateConsentOnUserProfile(consentState)
    return store
      .then(() => logger.debug('TrackingInitializer.updateConsent', 'persisted opt-in on consentStore'))
      .catch((error) => logError(error, 'Failed to store given tracking consent', errorContext))
      .then(() => this.optIn())
      .then(() => logger.debug('TrackingInitializer.updateConsent', 'opted-in on Posthog client'))
      .catch((error) => logError(error, 'Failed to opt-in into tracking', errorContext))
  }

  private updateConsentOnUserProfile = async (consentState: ConsentState): Promise<void> => {
    await this.apollo.mutate<UpdateAuthenticatedUserResponse, { input: Partial<UpdateAuthenticatedUserInput> }>({
      mutation: updateAuthenticatedUserMutation,
      variables: {
        input: {
          trackingConsentAnalytics: Consent.toBoolean(consentState[TrackingPurpose.Analytics]),
          trackingConsentPersonalization: Consent.toBoolean(consentState[TrackingPurpose.Personalization]),
        },
      },
    })
  }
}

const TrackingInitializer = ({ children }: PropsWithChildren) => {
  // don't initialize for SSR
  const isClient: boolean = typeof navigator !== 'undefined'
  return isClient ? <TrackingInitializerInner>{children}</TrackingInitializerInner> : <>{children}</>
}

const TrackingInitializerInner = ({ children }: PropsWithChildren) => {
  const posthog: PosthogCrossPlatform = usePosthogCrossPlatform()
  const apollo: ApolloClient<object> = useApolloClient()
  const tracking = useMemo(() => new Tracking(posthog, apollo), [posthog, apollo])
  const loggedInState = useLoggedInUser()
  const lkj = useConsentState()
  const consentState = useReactiveVar(consentStateVar)

  /*
  useEffect(() => {
    tracking.loadConsent(loggedInState).then((newState) => consentStateVar({ onLoad: true, state: newState }))
  }, [loggedInState, tracking])
  */

  useEffect(() => {
    lkj.initialLoad()
  }, [loggedInState, tracking])

  useEffect(() => {
    logger.debug('TrackingInitializer', 'updating consent state')
    if (!consentState.onLoad) {
      tracking.storeConsent(loggedInState, consentState.state)
    }
  }, [loggedInState, tracking, consentState])

  useEffect(() => {
    // TODO this should NOT be called on window resize
    if (loggedInState.isLoggedIn) {
      logger.debug('TrackingInitializer', 'login state loggedIn', JSON.stringify(loggedInState))
      tracking.initWithLoggedInUser(loggedInState.user)
    } else if (loggedInState.isLoggedOut) {
      logger.debug('TrackingInitializer', 'login state loggedOut')
      tracking.initWithLoggedOutUser()
    }
  }, [loggedInState, tracking])

  return <>{children}</>
}

export default memo(TrackingInitializer)
