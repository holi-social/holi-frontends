import React, { useCallback, useState } from 'react'
import {
  type FlatListProps,
  type LayoutChangeEvent,
  type LayoutRectangle,
  Platform,
  type ViewStyle,
} from 'react-native'
import { View } from 'react-native'
import Animated, {
  scrollTo,
  type SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import type { HoliTabsProps } from './types'

const isWeb = Platform.OS === 'web'

interface Props<D>
  extends Omit<
      HoliTabsProps<D>,
      'centeredTabButtons' | 'renderTabContent' | 'renderTabButton' | 'onChange' | 'variant'
    >,
    Pick<FlatListProps<D>, 'onScroll' | 'scrollEventThrottle' | 'onScrollBeginDrag' | 'onMomentumScrollEnd'> {
  renderItem: HoliTabsProps<D>['renderTabContent']
  width: number
  marginHorizontal?: number
  tabsId: string
}

const TabContentList = <D,>({
  data,
  keyExtractor,
  renderItem,
  activeTab,
  marginHorizontal = 0,
  width: componentWidth,
  testID = 'holi-tabs-content-list',
  tabsId,
  ...listProps
}: Props<D>) => {
  const activeTabIndex = data.findIndex((item) => keyExtractor(item) === activeTab)
  // Prpbably a RN or RNA bug: when we use `number` as a type for `initialScrollIndex` prop of Animated.FlatList
  // the first tab change is not animated. But when we use `SharedValue<number>` it works fine.
  const activeTabIndexSharedValue = useSharedValue(activeTabIndex)

  const [tabContentLayouts, setTabContentLayouts] = useState<Record<string, LayoutRectangle>>({})
  const saveTabContentLayout = useCallback(({ nativeEvent }: LayoutChangeEvent, id: string) => {
    if (nativeEvent) {
      setTabContentLayouts((prev) => ({ ...prev, [id]: nativeEvent.layout }))
    }
  }, [])

  const contentScrollViewRef = useAnimatedRef<Animated.FlatList<D>>()

  // Will be called when `activeTabIndex` changes
  useDerivedValue(() => {
    // Scroll to active tab content
    scrollTo(contentScrollViewRef, activeTabIndex * componentWidth, 0, true)
  }, [activeTabIndex, componentWidth])

  // Content list height animation styles
  const activeTabContentHeight = tabContentLayouts[activeTab]?.height ?? undefined
  const animFlatListHeightStyle = useAnimatedStyle(
    () => ({
      height: withTiming(activeTabContentHeight ?? undefined),
    }),
    [activeTabContentHeight]
  )
  // animating the height of the FlatList list does not work on web
  const flatListHeightStyle = isWeb ? { height: activeTabContentHeight } : animFlatListHeightStyle

  // WEB specific styles for snapToInterval of FlatList
  const listItemSnapToIntervalStyle = isWeb ? ({ scrollSnapAlign: 'start' } as ViewStyle) : undefined
  const flatListSnapToIntervalStyle = isWeb ? ({ scrollSnapType: 'x mandatory' } as ViewStyle) : undefined

  return (
    <Animated.FlatList
      ref={contentScrollViewRef}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }) => {
        const key = keyExtractor(item)
        const isActive = key === activeTab

        return (
          <View
            role="tabpanel"
            id={`${tabsId}-panel-${activeTab}`}
            style={[listItemSnapToIntervalStyle, { width: componentWidth }]}
          >
            <View onLayout={(event) => saveTabContentLayout(event, key)} style={{ marginHorizontal }}>
              {renderItem({ item, key, isActive, index })}
            </View>
          </View>
        )
      }}
      horizontal
      snapToInterval={componentWidth}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      bounces={false}
      // use `getItemLayout` to spicify correct item offset
      getItemLayout={(_, index) => ({ length: componentWidth, offset: componentWidth * index, index })}
      style={[flatListSnapToIntervalStyle, flatListHeightStyle]}
      testID={testID}
      initialScrollIndex={activeTabIndexSharedValue as SharedValue<number | null | undefined>}
      onScrollToIndexFailed={(error) => {
        setTimeout(() => scrollTo(contentScrollViewRef, error.index * componentWidth, 0, true), 300)
      }}
      {...listProps}
    />
  )
}

export default TabContentList
