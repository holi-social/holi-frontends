import { LoggedInState, LoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
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
  // TODO can we get rid of one of the two? does it work without explicit (de)serialization
  export const fromString = (str: string): Consent => {
    if (Object.values(Consent).includes(str as Consent)) {
      return str as Consent
    } else {
      throw new Error(`Invalid enum value: ${str}`)
    }
  }
  export const fromBoolean = (consent: boolean | undefined) => {
    switch (consent) {
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

export interface TrackingHook {
  trackEvent: (event: TrackingEvent) => void
  lifecycle: {
    appInit: (loggedInState: LoggedInState) => void
    userLoggedIn: (loggedInState: LoggedInUser) => void
    userLoggedOut: () => void
    updateConsent: (loggedInState: LoggedInState, consentState: ConsentState) => void
  }
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
