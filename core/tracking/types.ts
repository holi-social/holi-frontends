import { LoginState, LoginStateLoggedIn } from '@holi/core/auth/helpers/useAuth'
import { TrackingEvent } from '@holi/core/tracking/events'

export interface TrackingHook {
  trackEvent: (event: TrackingEvent) => void
  lifecycle: {
    appInit: (loginState: LoginState) => void
    userLoggedIn: (loginState: LoginStateLoggedIn) => void
    userLoggedOut: () => void
    userGaveTrackingConsent: () => void
    userDeniedTrackingConsent: () => void
  }
}

export interface PosthogCrossPlatform {
  optIn: () => Promise<void>
  optOut: () => Promise<void>
  reset: () => void
  capture: (
    event: string,
    properties?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any
    }
  ) => void
  identify: (distinctId?: string) => void
}
