export interface BaseTrackingEvent {
  name: string
  properties?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

export interface SpaceUpdatePosted extends BaseTrackingEvent {
  name: 'space_update_posted'
}

export interface SpaceCreated extends BaseTrackingEvent {
  name: 'space_created'
}

export type TrackingEvent = SpaceUpdatePosted | SpaceCreated
