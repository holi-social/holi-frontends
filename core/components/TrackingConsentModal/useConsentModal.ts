import { useEffect } from 'react'

import { listenOnLoginStateChange } from '@holi/core/auth/helpers/useAuth'
import { useIsFocused } from '@holi/core/helpers/useIsFocused'
import { listenOnOnboardingStateChange, useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { ConsentState } from '@holi/core/tracking/types'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

import {
  SCREENS_TO_VISIT_COUNT,
  resetUserVisitedScreensCount,
  useUserVisitedScreensCount,
} from './userVisitedScreensCount'

export const useConsentModal = () => {
  const userVisitedScreensCount = useUserVisitedScreensCount()
  const needToShowTrackingConsent = SCREENS_TO_VISIT_COUNT <= userVisitedScreensCount

  const isFocused = useIsFocused()
  const consentState = useConsentState()
  const needsConsentPermission = ConsentState.isUnknown(consentState)

  const onboardingState = useStoredOnboardingState()
  const isOnboardingFinished = onboardingState === 'finished'

  // TODO: in follow up ticket move user's onboarding state to BE and use that flag here
  const { isLoggedIn, isLoggedOut, user } = useLoggedInUser()
  const loggedOutOrUserWithIdentity = isLoggedOut || (isLoggedIn && !!user.identity)

  const { visible, show, hide } = useModalState()

  // listen on authenticated user changes and reset counter on logout
  useEffect(() => {
    const unsubscribe = listenOnLoginStateChange((curState, prevState) => {
      if (curState.isLoggedOut === true && prevState?.isLoggedOut === false) {
        resetUserVisitedScreensCount()
      }
    })
    return unsubscribe
  }, [])

  // listen on onboarding 'finished' state and reset counter
  useEffect(() => {
    const unsubscribe = listenOnOnboardingStateChange((curState, prevState) => {
      if (curState === 'finished' && prevState !== curState) {
        resetUserVisitedScreensCount()
      }
    })
    return unsubscribe
  }, [onboardingState])

  // listen on different events to show Consent modal
  useEffect(() => {
    if (
      isFocused && // mobile app should be on HomeFeed
      isOnboardingFinished && // Onboarding should be finished
      loggedOutOrUserWithIdentity && // user should be logged out or when logged in identity should be provided (after finishing finishing Onboarding)
      needsConsentPermission && // user needs consent permissions
      needToShowTrackingConsent // user visited minimum amount of screens
    ) {
      setTimeout(() => requestAnimationFrame(() => show()), 300)
    }
  }, [
    isFocused,
    isOnboardingFinished,
    loggedOutOrUserWithIdentity,
    needToShowTrackingConsent,
    needsConsentPermission,
    show,
  ])

  return {
    visible,
    show,
    hide,
  }
}
