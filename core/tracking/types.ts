import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'
import { TrackingEvent } from '@holi/core/tracking/events'

export enum TrackingPurpose {
  Analytics = 'ANALYTICS',
  Personalization = 'PERSONALIZATION',
}

export enum Consent {
  Unknown = 'unknown',
  Given = 'given',
  Denied = 'denied',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Consent {
  export const fromBoolean = (consent: boolean | undefined) => {
    switch (consent) {
      case null:
        return Consent.Unknown
      case undefined:
        return Consent.Unknown
      case true:
        return Consent.Given
      case false:
        return Consent.Denied
    }
  }
  export const toBoolean = (consent: Consent): boolean | undefined => {
    switch (consent) {
      case Consent.Given:
        return true
      case Consent.Denied:
        return false
      case Consent.Unknown:
        return undefined
    }
  }
}

export interface ConsentState extends Record<TrackingPurpose, Consent> {
  [TrackingPurpose.Analytics]: Consent
  [TrackingPurpose.Personalization]: Consent
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ConsentState {
  export const unknown: ConsentState = {
    [TrackingPurpose.Analytics]: Consent.Unknown,
    [TrackingPurpose.Personalization]: Consent.Unknown,
  }
  export const fromUser = (user: AuthenticatedUser): ConsentState => ({
    [TrackingPurpose.Analytics]: Consent.fromBoolean(user.trackingConsentAnalytics),
    [TrackingPurpose.Personalization]: Consent.fromBoolean(user.trackingConsentPersonalization),
  })
}

export interface TrackingHook {
  trackEvent: (event: TrackingEvent) => void
}

export interface PosthogCrossPlatform {
  optedIn: () => boolean
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
