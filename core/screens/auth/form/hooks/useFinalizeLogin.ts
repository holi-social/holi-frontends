import { useApolloClient } from '@apollo/client/react'
import { doLogin } from '@holi/core/auth/helpers/auth'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useCallback } from 'react'

export const useFinalizeLogin = () => {
  const client = useApolloClient()
  const { track } = useTracking()
  const redirect = useRedirect()

  const finalizeLogin = useCallback(
    async (data: OrySessionContext) => {
      await doLogin(client, data)
      // TODO(SF) pass step as param?
      track(TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'login' }))
      storeOnboardingState('finished')
      redirect(true)
    },
    [client, track, redirect]
  )

  return finalizeLogin
}
