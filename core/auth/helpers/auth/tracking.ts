import { TrackingEvent } from '@holi/core/tracking'
import type {
  UpdateLoginFlowBody,
  UpdateLoginFlowWithCodeMethod,
  UpdateRegistrationFlowBody,
  UpdateRegistrationFlowWithCodeMethod,
} from '@ory/kratos-client'

const getOTPStep = (
  payload: UpdateLoginFlowWithCodeMethod | UpdateRegistrationFlowWithCodeMethod
): Parameters<typeof TrackingEvent.Auth.OneTimeCodePressed>[0]['step'] => {
  if (payload.resend) {
    return 'resend'
  }
  if (payload.code) {
    return 'code'
  }
  return 'email'
}

export const getTrackingEventForLoginFlowSubmit = ({
  payload,
  provider,
}: {
  payload: UpdateLoginFlowBody
  provider?: string
}): TrackingEvent => {
  if (payload.method === 'code') {
    return TrackingEvent.Auth.OneTimeCodePressed({
      step: getOTPStep(payload),
      screen: 'mainLogin',
    })
  }
  if (provider) {
    return TrackingEvent.Auth.SocialLoginButtonPressed({
      provider,
      screen: 'mainLogin',
    })
  }
  return TrackingEvent.Auth.LoginButtonPressed
}

export const getTrackingEventForRegistrationFlowSubmit = ({
  payload,
  screen,
  provider,
}: {
  payload: UpdateRegistrationFlowBody
  provider?: string
  screen: TrackingEvent.AuthScreen
}): TrackingEvent => {
  if (payload.method === 'code') {
    return TrackingEvent.Auth.OneTimeCodePressed({
      step: getOTPStep(payload),
      screen,
    })
  }
  if (provider) {
    return TrackingEvent.Auth.SocialRegisterButtonPressed({
      provider,
      screen,
    })
  }
  return TrackingEvent.Auth.RegisterButtonPressed
}
