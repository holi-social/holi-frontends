import { TrackingEvent } from '@holi/core/tracking/events'

export interface TrackingHook {
  trackEvent: (event: TrackingEvent, eventProperties?: object) => void
  optedIn: () => boolean
  optIn: () => Promise<void>
  optOut: () => Promise<void>
  identify: (userId: string) => void
  reset: () => void
}
