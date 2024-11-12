import React, { type PropsWithChildren, ReactNode } from 'react'
import { IntersectionObserverProps, useInView } from 'react-intersection-observer'
import { FlatList, ListRenderItem } from 'react-native'

import {
  TrackableFlatListItem as TrackableFlatListItemType,
  TrackableFlatListProps,
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
      inView && onInView(item)
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

  return <FlatList {...restProps} renderItem={extendedRenderItem} />
}

export default TrackableFlatList
