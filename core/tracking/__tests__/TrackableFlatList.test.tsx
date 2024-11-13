import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { ListRenderItem, View } from 'react-native'
// @ts-ignore
import { ReactTestInstance } from 'react-test-renderer'

import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import { TrackableFlatListParams, defaultViewabilityConfig } from '@holi/core/tracking/TrackableFlatList.shared'

const data = [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }]

let listElement: ReactTestInstance
let listItems: ReactTestInstance[]

jest.useFakeTimers()

const renderTrackableFlatList = ({
  listItemTrackingEvent,
  listItemIdentifier,
  minimumViewTime = defaultViewabilityConfig.minimumViewTime,
  itemVisiblePercentThreshold = 100,
  trackOnce = false,
}: TrackableFlatListParams) => {
  const renderItem: ListRenderItem<{ index: number }> = ({ item: { index } }) => <View testID="list-item">{index}</View>

  const { getByTestId, getAllByTestId } = render(
    <TrackableFlatList
      minimumViewTime={minimumViewTime}
      data={data}
      trackOnce={trackOnce}
      itemVisiblePercentThreshold={itemVisiblePercentThreshold}
      testID="list"
      renderItem={renderItem}
      listItemTrackingEvent={listItemTrackingEvent}
      listItemIdentifier={listItemIdentifier}
    />
  )

  listElement = getByTestId('list')
  listItems = getAllByTestId(/^list-item/)
}

const scrollTrackableFlatList = ({
  inViewItemsAmount = data.length,
  minimumViewTime = defaultViewabilityConfig.minimumViewTime,
  itemVisiblePercentThreshold = 100,
}: {
  inViewItemsAmount?: number
  minimumViewTime?: number
  itemVisiblePercentThreshold?: number
}) => {
  // an example item height to update layout with (can be any value > 0)
  const itemHeight = 100

  act(() => {
    // generate a layout in which every item of the list has the provided height and is placed one after another
    listItems.forEach((item, index) => {
      fireEvent(item, 'layout', {
        nativeEvent: {
          layout: { height: itemHeight, y: index * itemHeight },
        },
      })
    })

    // ReactNative's FlatList uses "layout" events in order to know when to trigger "onViewableItemsChanged"
    // In order to test this behaviour in Jest environment, we need to synthetically fire this event
    // To control how many list elements should be considered as "in view", we multiply item's height by inViewItemsAmount
    // To test "itemVisiblePercentThreshold" param, we "scroll" the last element (inViewItemsAmount - 1) to the provided percentage value
    fireEvent(listElement, 'layout', {
      nativeEvent: {
        layout: {
          height: itemHeight * (inViewItemsAmount - 1) + (itemHeight * itemVisiblePercentThreshold) / 100,
        },
      },
    })

    // To test "minimumViewTime" param, we synthetically wait for the provided time + additional 100ms (value needed for "layout" event to be triggered)
    jest.advanceTimersByTime(minimumViewTime + 100)
  })
}

describe('TrackableFlatList', () => {
  describe('minimumViewTime param', () => {
    it('fires listItemTrackingEvent if minimumViewTime is not provided', () => {
      const callback = jest.fn()

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
      })
      scrollTrackableFlatList({})

      expect(callback).toHaveBeenCalled()
    })

    it('fires listItemTrackingEvent if minimumViewTime is 3s', () => {
      const callback = jest.fn()
      const minimumViewTime = 3000

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
        minimumViewTime,
      })
      scrollTrackableFlatList({ minimumViewTime })

      expect(callback).toHaveBeenCalledTimes(data.length)

      data.forEach((item) => expect(callback).toHaveBeenCalledWith(item))
    })

    it('fires listItemTrackingEvent if minimumViewTime is 0', () => {
      const callback = jest.fn()
      const minimumViewTime = 0

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
        minimumViewTime,
      })
      scrollTrackableFlatList({ minimumViewTime })

      expect(callback).toHaveBeenCalledTimes(data.length)

      data.forEach((item) => expect(callback).toHaveBeenCalledWith(item))
    })
  })

  describe('listItemTrackingEvent param', () => {
    it('fires listItemTrackingEvent for all items when they are in view', () => {
      const callback = jest.fn()

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
      })
      scrollTrackableFlatList({})

      expect(callback).toHaveBeenCalledTimes(data.length)

      data.forEach((item) => expect(callback).toHaveBeenCalledWith(item))
    })

    it('fires listItemTrackingEvent for 2 first items when they are in view', () => {
      const callback = jest.fn()
      const inViewItemsAmount = 2

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
      })
      scrollTrackableFlatList({ inViewItemsAmount })

      expect(callback).toHaveBeenCalledTimes(inViewItemsAmount)
      expect(callback).toHaveBeenCalledWith(data[0])
      expect(callback).toHaveBeenCalledWith(data[1])
    })

    it('does not fire listItemTrackingEvent if no items are in view', () => {
      const callback = jest.fn()
      const inViewItemsAmount = 0

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
      })
      scrollTrackableFlatList({ inViewItemsAmount })

      expect(callback).toHaveBeenCalledTimes(inViewItemsAmount)
    })
  })

  describe('trackOnce param', () => {
    it('fires listItemTrackingEvent only once when scrolling back and force', () => {
      const callback = jest.fn()

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
        trackOnce: true,
      })

      scrollTrackableFlatList({})
      scrollTrackableFlatList({ inViewItemsAmount: 0 })
      scrollTrackableFlatList({})
      scrollTrackableFlatList({ inViewItemsAmount: 0 })
      scrollTrackableFlatList({})

      expect(callback).toHaveBeenCalledTimes(data.length)

      data.forEach((item) => expect(callback).toHaveBeenCalledWith(item))
    })

    it('fires listItemTrackingEvent only once when scrolling with items still in view', () => {
      const callback = jest.fn()

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
        trackOnce: true,
      })

      scrollTrackableFlatList({})
      scrollTrackableFlatList({})
      scrollTrackableFlatList({})

      expect(callback).toHaveBeenCalledTimes(data.length)

      data.forEach((item) => expect(callback).toHaveBeenCalledWith(item))
    })
  })

  describe('itemVisiblePercentThreshold param', () => {
    it('fires listItemTrackingEvent when 80% of the first item is in view', () => {
      const callback = jest.fn()
      const itemVisiblePercentThreshold = 80

      renderTrackableFlatList({
        listItemTrackingEvent: callback,
        listItemIdentifier: () => 'id',
        itemVisiblePercentThreshold,
      })
      scrollTrackableFlatList({ itemVisiblePercentThreshold, inViewItemsAmount: 1 })

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(data[0])
    })
  })

  it('fires listItemTrackingEvent when 30% of the second item is in view', () => {
    const callback = jest.fn()
    const itemVisiblePercentThreshold = 30

    renderTrackableFlatList({
      listItemTrackingEvent: callback,
      listItemIdentifier: () => 'id',
      itemVisiblePercentThreshold,
    })
    scrollTrackableFlatList({ itemVisiblePercentThreshold, inViewItemsAmount: 2 })

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalledWith(data[0])
    expect(callback).toHaveBeenCalledWith(data[1])
  })

  it('does fire multiple times for multiple scrolls when each time only 30% is in view', () => {
    const callback = jest.fn()
    const itemVisiblePercentThreshold = 30

    renderTrackableFlatList({
      listItemTrackingEvent: callback,
      listItemIdentifier: () => 'id',
      itemVisiblePercentThreshold,
    })

    expect(callback).toHaveBeenCalledTimes(0)

    for (const i of [1, 2, 3, 4, 5]) {
      scrollTrackableFlatList({ itemVisiblePercentThreshold, inViewItemsAmount: i })
      expect(callback).toHaveBeenCalledTimes(i)
      expect(callback).toHaveBeenCalledWith(data[i - 1])
    }
  })
})
