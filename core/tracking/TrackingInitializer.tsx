import React, { PropsWithChildren, memo, useEffect, useState } from 'react'

import { LoginState, useAuth } from '@holi/core/auth/helpers/useAuth'
import { getLogger } from '@holi/core/helpers/logging'
import useTracking from '@holi/core/tracking/hooks/useTracking'

const logger = getLogger('Tracking')

const TrackingInitializer = ({ children }: PropsWithChildren) => {
  // don't initialize for SSR
  const isClient: boolean = typeof navigator !== 'undefined'
  return isClient ? <TrackingInitializerInner>{children}</TrackingInitializerInner> : <>{children}</>
}

const TrackingInitializerInner = ({ children }: PropsWithChildren) => {
  const loginState = useAuth()
  const tracking = useTracking()
  const [previousLoginState, setPreviousLoginState] = useState<LoginState | undefined>(loginState)

  logger.debug('TrackingInitializer', 'init tracking')
  tracking.lifecycle.appInit(loginState)

  useEffect(() => {
    if (loginState.isUnknown) {
      logger.debug('TrackingInitializer', 'login state unknown')
    } else if (loginState.isLoggedIn) {
      logger.debug('TrackingInitializer', 'login state loggedIn')
      tracking.lifecycle.userLoggedIn(loginState)
    } else if (loginState.isLoggedOut) {
      logger.debug('TrackingInitializer', 'login state loggedOut')
      // TODO must not be called by mere app-initialization, only on actual logout
      if (previousLoginState?.isLoggedIn) {
        logger.debug('TrackingInitializer', 'login state loggedOut - user was previously loggedIn, assuming logout')
        tracking.lifecycle.userLoggedOut()
      }
    }
    setPreviousLoginState(loginState)
  }, [loginState, tracking.lifecycle, previousLoginState, setPreviousLoginState])

  /*
  // TODO HOLI-7894 - remove after development
  useEffect(() => {
    setTimeout(() => {
      tracking.lifecycle.userGaveTrackingConsent()
    }, 5 * 1000)
  })


  // TODO HOLI-7894 - remove after development
  useEffect(() => {
    setTimeout(() => {
      tracking.lifecycle.userDeniedTrackingConsent()
    }, 20 * 1000)
  })*/

  return <>{children}</>
}

export default memo(TrackingInitializer)
