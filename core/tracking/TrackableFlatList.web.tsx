import React, { type PropsWithChildren, type ReactNode, useRef } from 'react'
import { type IntersectionObserverProps, useInView } from 'react-intersection-observer'
import { FlatList, type ListRenderItem } from 'react-native'

import {
  type TrackableFlatListItem as TrackableFlatListItemType,
  type TrackableFlatListProps,
  defaultViewabilityConfig,
} from '@holi/core/tracking/TrackableFlatList.shared'
import useTracking from '@holi/core/tracking/hooks/useTracking'

const TrackableFlatListItem = ({
  children,
  item,
  onInView,
  triggerOnce,
  threshold,
  delay,
}: PropsWithChildren<
  {
    item: TrackableFlatListItemType
    onInView: (item: TrackableFlatListItemType) => void
  } & IntersectionObserverProps
>): ReactNode => {
  const { ref } = useInView({
    triggerOnce,
    threshold,
    delay,
    fallbackInView: true,
    onChange: (inView: boolean) => {
      if (inView) onInView(item)
    },
  })

  return (
    <div ref={ref} style={{ display: 'flex' }}>
      {children}
    </div>
  )
}

const TrackableFlatList = ({
  minimumViewTime,
  itemVisiblePercentThreshold,
  listItemTrackingEvent,
  trackOnce = false,
  renderItem,
  ...restProps
}: TrackableFlatListProps) => {
  const flatListRef = useRef<FlatList<TrackableFlatListItemType>>(null)

  const { track } = useTracking()

  const onInView = (item: TrackableFlatListItemType) => {
    track(listItemTrackingEvent(item))
  }

  const threshold =
    (itemVisiblePercentThreshold !== undefined
      ? itemVisiblePercentThreshold
      : defaultViewabilityConfig.itemVisiblePercentThreshold) / 100
  const delay = minimumViewTime !== undefined ? minimumViewTime : defaultViewabilityConfig.minimumViewTime

  const extendedRenderItem: ListRenderItem<TrackableFlatListItemType> = ({ item, ...otherParams }) => (
    <TrackableFlatListItem item={item} onInView={onInView} triggerOnce={trackOnce} threshold={threshold} delay={delay}>
      {item && renderItem && renderItem({ item, ...otherParams })}
    </TrackableFlatListItem>
  )

  return (
    <FlatList
      {...restProps}
      ref={flatListRef}
      renderItem={extendedRenderItem as ListRenderItem<TrackableFlatListItemType>}
    />
  )
}

export default TrackableFlatList
