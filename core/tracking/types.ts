import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
import type { TrackingEvent } from '@holi/core/tracking/events'

export enum TrackingPurpose {
  Analytics = 'ANALYTICS',
  Personalization = 'PERSONALIZATION',
  AdPartners = 'AD_PARTNERS',
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
  [TrackingPurpose.AdPartners]: Consent
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ConsentState {
  export const unknown: ConsentState = {
    [TrackingPurpose.Analytics]: Consent.Unknown,
    [TrackingPurpose.Personalization]: Consent.Unknown,
    [TrackingPurpose.AdPartners]: Consent.Unknown,
  }
  export const isUnknown = (cs: ConsentState): boolean => Object.values(cs).every((value) => value === Consent.Unknown)

  export const fromUser = (user: AuthenticatedUser): ConsentState => ({
    [TrackingPurpose.Analytics]: Consent.fromBooleanOrNullOrUndefined(user.trackingConsentAnalytics),
    [TrackingPurpose.Personalization]: Consent.fromBooleanOrNullOrUndefined(user.trackingConsentPersonalization),
    [TrackingPurpose.AdPartners]: Consent.fromBooleanOrNullOrUndefined(user.trackingConsentAdPartners),
  })

  // can be used to attach the current consent state for every purpose to events sent to PostHog. This way, when
  // processing events it can be ensured that only events are included for which the user gave explicit consent at
  // the time the event was recorded and the events are only used for the purpose that the user gave consent for.
  export const toEventProperties = (cs: ConsentState): Record<string, boolean | null> => ({
    trackingConsentAnalytics: Consent.toBooleanOrNull(cs[TrackingPurpose.Analytics]),
    trackingConsentPersonalization: Consent.toBooleanOrNull(cs[TrackingPurpose.Personalization]),
    trackingConsentAdPartners: Consent.toBooleanOrNull(cs[TrackingPurpose.AdPartners]),
  })
}

// redundant, but needed in jest.setup.js
export type TrackingEventHandler = (event: TrackingEvent) => void

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
  distinctId: () => string
  updatePersonProperties: (properties?: Properties) => void
  flush: () => Promise<void>
}

export type MetaPixelStandardEvent = 'PageView' | 'ViewContent' | 'Search' | 'CompleteRegistration' | 'SignUp'

export interface FacebookSdkCrossPlatform {
  initialize(user?: AuthenticatedUser): Promise<void>
  optIn(user?: AuthenticatedUser): Promise<void>
  optOut(): Promise<void>
  enabled(): Promise<boolean>
  trackSignUp(): Promise<void>
  trackEvent(event: MetaPixelStandardEvent, data?: Record<string, unknown>): Promise<void>
}

export type SignupModalPressedTrigger =
  | 'JOIN_SPACE'
  | 'FOLLOW_SPACE'
  | 'LIKE_POST'
  | 'CREATE_CHALLENGE_VIDEO'
  | 'CREATE_POST'
  | 'CREATE_SPACE'
  | 'COMMENT_ON_POST'
  | 'COMMENT_ON_CHALLENGE'
  | 'COMMENT_ON_INSIGHT'
  | 'REPLY_COMMENT_ON_POST'
  | 'REPLY_COMMENT_ON_CHALLENGE'
  | 'REPLY_COMMENT_ON_INSIGHT'
  | 'REACT_COMMENT_ON_POST'
  | 'REACT_COMMENT_ON_INSIGHT'
  | 'REACT_COMMENT_ON_CHALLENGE'
  | 'REACT_ON_CHALLENGE'
  | 'REACT_ON_INSIGHT'
  | 'REACT_ON_POST'
  | 'FAVORITE_ON_INSIGHT'
  | 'VIEW_DISCUSSION_COMMENT_ON_INSIGHT'
  | 'POLL_ANSWER_INSIGHT'
  | 'START_CHAT'
  | 'CONNECT_TO_USER'
  | 'GET_IN_TOUCH'
  | 'COLLECT_GOOD_DEEDS'
