import { useApolloClient } from '@apollo/client/react'
import { doLogin } from '@holi/core/auth/helpers/auth'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { TrackingEvent } from '@holi/core/tracking'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useCallback } from 'react'

export const useFinalizeRegistration = (onRegister?: () => void) => {
  const client = useApolloClient()
  const { track } = useTracking()

  const finalizeRegistration = useCallback(
    async (data: OrySessionContext) => {
      await doLogin(client, data)

      track(TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'signUp' }))
      metaSdk.trackSignUp()
      onRegister?.()
    },
    [client, track, onRegister]
  )

  return finalizeRegistration
}
