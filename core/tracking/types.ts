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
  export const fromBooleanOrNullOrUndefined = (consent: boolean | undefined | null) => {
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
  export const toBooleanOrNull = (consent: Consent): boolean | null => {
    switch (consent) {
      case Consent.Given:
        return true
      case Consent.Denied:
        return false
      case Consent.Unknown:
        return null
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
  export const isUnknown = (cs: ConsentState): boolean => Object.values(cs).every((value) => value === Consent.Unknown)

  export const fromUser = (user: AuthenticatedUser): ConsentState => ({
    [TrackingPurpose.Analytics]: Consent.fromBooleanOrNullOrUndefined(user.trackingConsentAnalytics),
    [TrackingPurpose.Personalization]: Consent.fromBooleanOrNullOrUndefined(user.trackingConsentPersonalization),
  })
}

export interface TrackingHook {
  /**
   * Tracks the given event. Guaranteed not to throw errors, so no error handling necessary around calls.
   *
   * @param event the event to track
   */
  track: (event: TrackingEvent) => void
}

export type Properties = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface PosthogCrossPlatform {
  optedIn: () => boolean
  optIn: () => Promise<void>
  optOut: () => Promise<void>
  reset: () => void
  capture: (event: string, properties?: Properties) => void
  identify: (distinctId: string, properties?: Properties) => void
}
