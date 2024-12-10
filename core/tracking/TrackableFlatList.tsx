import type React from 'react'
import { useCallback, useRef, useState } from 'react'
import { FlatList, type LayoutChangeEvent } from 'react-native'
import { FlashList, type FlashListProps } from '@shopify/flash-list'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import {
  type CustomViewabilityConfig,
  type TrackableFlatListItem,
  type TrackableFlatListProps,
  defaultViewabilityConfig,
} from '@holi/core/tracking/TrackableFlatList.shared'
import useTracking from '@holi/core/tracking/hooks/useTracking'

const TrackableFlatList = ({
  itemVisiblePercentThreshold,
  minimumViewTime,
  listItemTrackingEvent,
  listItemIdentifier,
  trackOnce,
  withFlashList = false,
  estimatedItemSize,
  ...restProps
}: TrackableFlatListProps) => {
  const { track } = useTracking()

  const list = useRef<FlatList | FlashList<TrackableFlatListItem>>(null)

  const [listBelowFoldThreshold, setListBelowFoldThreshold] = useState(0)
  const [isListTrackingInitialized, setIsListTrackingInitialized] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTrackedItems] = useState<Record<string, boolean>>({})

  const trackItem = (item: TrackableFlatListItem) => {
    track(listItemTrackingEvent(item))
  }

  const viewabilityConfig: CustomViewabilityConfig = {
    ...defaultViewabilityConfig,
    minimumViewTime: minimumViewTime ?? defaultViewabilityConfig.minimumViewTime,
    itemVisiblePercentThreshold: itemVisiblePercentThreshold ?? defaultViewabilityConfig.itemVisiblePercentThreshold,
  }

  const onViewableItemsChanged: TrackableFlatListProps['onViewableItemsChanged'] = (info) => {
    // Filter out "changed" elements that are not visible on the screen AND have been already tracked
    const visibleItems = info.changed.filter((entry) => entry.isViewable)

    // Early return if no new viewed elements available
    if (!visibleItems.length) return

    // If "trackOnce" is false, we loop through all "visibleItems" and trigger tracking callback for all array elements
    if (!trackOnce) {
      visibleItems.forEach(({ item }) => trackItem(item))
      return
    }

    // If "trackOnce" is true, we save already tracked items and trigger tracking callback only for the new ones
    setTrackedItems((prevTrackedItems) => {
      const newVisibleItems = visibleItems.reduce((acc, { item }) => {
        const id = listItemIdentifier(item)

        // Send the tracking event for the item if it hasn't been tracked yet
        if (!prevTrackedItems[item[id]]) {
          trackItem(item)
        }

        return {
          ...acc,
          [item[id]]: true,
        }
      }, {})

      // Update state with the new tracked items
      return {
        ...prevTrackedItems,
        ...newVisibleItems,
      }
    })
  }

  // To precisely know when to trigger "onListIsInView", we need to calculate "belowFoldThreshold".
  // "itemVisiblePercentThreshold" should be considered while calculating this value.
  const onListLayout = (event: LayoutChangeEvent) => {
    const listHeight = event.nativeEvent.layout.height
    const itemVisiblePercentThreshold = viewabilityConfig.itemVisiblePercentThreshold
    const listBelowFoldThreshold = Math.round((listHeight * itemVisiblePercentThreshold) / 100)

    setListBelowFoldThreshold(listBelowFoldThreshold)
  }

  // By default, "onViewableItemsChanged" is triggered on first render for all initially visible elements.
  // To prevent that, we need to wait until the list actually appears on the screen for the first time.
  // After tracking is initialized, we can hide ScrollBasedCallbackInvocation to avoid unnecessary scroll event listeners.
  const onListIsInView = () => {
    list.current?.recordInteraction()
    setIsListTrackingInitialized(true)
  }

  // According to RN, the following callback cannot be updated after the initial render, therefore we keep deps as []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onViewableItemsChangedCallback = useCallback(onViewableItemsChanged, [])

  return (
    <>
      {!isListTrackingInitialized ? (
        <ScrollBasedCallbackInvocation
          callback={onListIsInView}
          belowFoldThreshold={listBelowFoldThreshold}
          placeholder={<></>}
        />
      ) : null}
      {withFlashList ? (
        <FlashList
          {...(restProps as FlashListProps<TrackableFlatListItem>)}
          ref={list as React.RefObject<FlashList<TrackableFlatListItem>>}
          onLayout={onListLayout}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChangedCallback}
          estimatedItemSize={estimatedItemSize}
        />
      ) : (
        <FlatList
          {...restProps}
          ref={list as React.RefObject<FlatList>}
          onLayout={onListLayout}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChangedCallback}
        />
      )}
    </>
  )
}

export default TrackableFlatList
