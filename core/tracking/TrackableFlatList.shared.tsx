import type { FlatList, FlatListProps } from 'react-native'

import type { TrackingEvent } from '@holi/core/tracking/events'

import type { FlashList } from '@shopify/flash-list'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrackableFlatListItem = any

export type ListItemTrackingEvent<T> = (item: T) => TrackingEvent
export type ListItemIdentifier<T> = (item: T) => string | number

export type TrackableFlatListParams = {
  // a callback that returns a tracking event for the provided list item
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listItemTrackingEvent: ListItemTrackingEvent<any>

  // a callback that returns an identifier for the provided list item
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listItemIdentifier: ListItemIdentifier<any>

  // an item visible percent threshold - see https://reactnative.dev/docs/flatlist#viewabilityconfig
  itemVisiblePercentThreshold?: number

  // a minimum view time before item is considered as "viewed" - see https://reactnative.dev/docs/flatlist#viewabilityconfig
  minimumViewTime?: number

  // a flag that defines whether an item should be tracked only once or every time it's viewed
  trackOnce?: boolean

  ref?: React.Ref<FlatList<TrackableFlatListItem> | typeof FlashList<TrackableFlatListItem>>
}

export type TrackableFlatListProps = FlatListProps<TrackableFlatListItem> &
  TrackableFlatListParams & {
    withFlashList?: boolean
    onLastViewedIndexChange?: (index: number) => void
  }

export type CustomViewabilityConfig = {
  itemVisiblePercentThreshold: number
  minimumViewTime: number
  waitForInteraction: boolean
}

export const defaultViewabilityConfig: CustomViewabilityConfig = {
  itemVisiblePercentThreshold: 80,
  minimumViewTime: 1000,
  waitForInteraction: true,
}
