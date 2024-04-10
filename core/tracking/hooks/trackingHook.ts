import { TrackingEvent } from '@holi/core/tracking/events'

export interface TrackingHook {
  trackEvent: (event: TrackingEvent, eventProperties?: object) => void
}
