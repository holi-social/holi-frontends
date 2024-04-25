import React, { PropsWithChildren, memo, useEffect, useState } from 'react'

import { getLogger } from '@holi/core/helpers/logging'
import { LoggedInState, useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Consent, TrackingPurpose } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

const TrackingInitializer = ({ children }: PropsWithChildren) => {
  // don't initialize for SSR
  const isClient: boolean = typeof navigator !== 'undefined'
  return isClient ? <TrackingInitializerInner>{children}</TrackingInitializerInner> : <>{children}</>
}

const TrackingInitializerInner = ({ children }: PropsWithChildren) => {
  const loggedInState = useLoggedInUser()
  const tracking = useTracking()
  const [previousLoginState, setPreviousLoginState] = useState<LoggedInState | undefined>(loggedInState)

  logger.debug('TrackingInitializer', 'init tracking')
  tracking.lifecycle.appInit(loggedInState)

  // TODO move lifecycle methods from hook here?

  useEffect(() => {
    if (loggedInState.isLoading) {
      logger.debug('TrackingInitializer', 'login state unknown')
    } else if (loggedInState.isLoggedIn) {
      logger.debug('TrackingInitializer', 'login state loggedIn')
      tracking.lifecycle.userLoggedIn(loggedInState)
    } else if (loggedInState.isLoggedOut) {
      logger.debug('TrackingInitializer', 'login state loggedOut')
      // TODO must not be called by mere app-initialization, only on actual logout
      if (previousLoginState?.isLoggedIn) {
        logger.debug('TrackingInitializer', 'login state loggedOut - user was previously loggedIn, assuming logout')
        tracking.lifecycle.userLoggedOut()
      }
    }
    setPreviousLoginState(loggedInState)
  }, [loggedInState, tracking.lifecycle, previousLoginState, setPreviousLoginState])

  // TODO HOLI-7894 - remove after development
  useEffect(() => {
    setTimeout(() => {
      tracking.lifecycle.updateConsent(loggedInState, {
        [TrackingPurpose.Analytics]: Consent.Given,
        [TrackingPurpose.Personalization]: Consent.Denied,
      })
    }, 5 * 1000)
  })

  /*
  // TODO HOLI-7894 - remove after development
  useEffect(() => {
    setTimeout(() => {
      tracking.lifecycle.updateConsent(loggedInState, {
        [TrackingPurpose.Analytics]: Consent.Denied,
        [TrackingPurpose.Personalization]: Consent.Denied,
      })
    }, 20 * 1000)
  })
  */

  return <>{children}</>
}

export default memo(TrackingInitializer)
