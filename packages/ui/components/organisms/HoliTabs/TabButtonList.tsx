import React, { useCallback, useMemo, useState } from 'react'
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import Animated, {
  type SharedValue,
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import type { HoliTabsProps } from './types'

export interface Tab {
  id?: string | number // ID is optional, if it is not passed tab's `index` in array will be used
  title: string
  titleIcons?: [HoliIconType, HoliIconType]
}

const TAB_SPACING = 20

interface Props<D> extends Omit<HoliTabsProps<D>, 'renderTabContent' | 'renderTabButton' | 'onChange' | 'variant'> {
  renderItem: HoliTabsProps<D>['renderTabContent']
  width: number
  contentScrollOffsetX?: SharedValue<number>
  marginHorizontal?: number
}

const TabButtonList = <D,>({
  data,
  keyExtractor,
  renderItem,
  activeTab,
  centeredTabButtons = false,
  marginHorizontal = 0,
  width: componentWidth,
  contentScrollOffsetX,
  testID = 'holi-tabs-button-list',
}: Props<D>) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const activeTabIndex = data.findIndex((item) => keyExtractor(item) === activeTab)
  const getIndexByKey = (key: string) => data.findIndex((item) => keyExtractor(item) === key)

  // Rely on `key` for data item instead of `index`. So, use data item `key` as a key in `tabButtonsLayouts` object
  const [tabButtonsLayouts, setTabButtonsLayouts] = useState<Record<string, LayoutRectangle>>({})
  // Derive `tabButtonsLayoutsSyncList` to get access to the layout of the tab button by index on UI thread for animations
  const tabButtonsLayoutsSyncList = Object.entries(tabButtonsLayouts).reduce<(LayoutRectangle & { key: string })[]>(
    (acc, [key, layout]) => {
      const index = getIndexByKey(key)
      if (index > -1) acc[index] = { ...layout, key }
      return acc
    },
    []
  )

  const tabButtonsScrollViewRef = useAnimatedRef<Animated.ScrollView>()

  // On layout handlers
  const saveTabButtonLayout = useCallback(({ nativeEvent }: LayoutChangeEvent, id: string) => {
    if (nativeEvent) {
      setTabButtonsLayouts((prev) => ({ ...prev, [id]: nativeEvent.layout }))
    }
  }, [])

  // Will be called when `activeTabIndex` changes
  useDerivedValue(() => {
    // Scroll to active tab button
    const tabButtonLayout = tabButtonsLayouts[activeTab]
    if (tabButtonLayout) {
      const scrollOffsetX = tabButtonLayout.x - componentWidth / 2 + tabButtonLayout.width / 2
      scrollTo(tabButtonsScrollViewRef, scrollOffsetX, 0, true)
    }
  }, [activeTabIndex, componentWidth])

  const activeTabButtonLayout = tabButtonsLayouts[activeTab] ?? {}
  const activeIndicatorWidth = useSharedValue(activeTabButtonLayout.width ?? 0)
  const activeIndicatorLeftPosition = useSharedValue(activeTabButtonLayout.x ?? 0)

  // React to `activeTabButtonLayout` changes (when user clicks on tab button)
  // and update active indicator position
  useAnimatedReaction(
    () => activeTabButtonLayout,
    ({ width = 0, x = 0 }) => {
      activeIndicatorWidth.value = withTiming(width)
      activeIndicatorLeftPosition.value = withSpring(x, { stiffness: 80, damping: 12 })
    }
  )

  // React to content scroll offset changes (when user scrolls the content)
  // and update active indicator position
  useAnimatedReaction(
    () => contentScrollOffsetX?.value,
    (contentOffsetX) => {
      // Animate only when user is dragging the content
      // and not when the content is scrolled programmatically
      if (tabButtonsLayoutsSyncList.length < 2 || contentOffsetX === undefined) return

      const dragIndex = contentOffsetX / componentWidth

      const inputRange = data.map((_, idx) => idx)
      activeIndicatorWidth.value = interpolate(
        dragIndex,
        inputRange,
        tabButtonsLayoutsSyncList.map(({ width }) => width)
      )
      activeIndicatorLeftPosition.value = interpolate(
        dragIndex,
        inputRange,
        tabButtonsLayoutsSyncList.map(({ x }) => x)
      )
    }
  )

  // Animated styles
  // Active tab button indicator styles
  const activeIndicatorStyle = useAnimatedStyle(
    () => ({
      width: activeIndicatorWidth.value,
      left: activeIndicatorLeftPosition.value,
    }),
    [activeIndicatorWidth, activeIndicatorLeftPosition]
  )

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.tabButtonsContainer, centeredTabButtons && styles.tabButtonsContainer_centered]}
      ref={tabButtonsScrollViewRef}
      testID={testID}
      role="tablist"
    >
      {data.map((item, index) => {
        const key = keyExtractor(item)
        const isActive = key === activeTab

        return (
          <View
            key={key}
            onLayout={(event) => saveTabButtonLayout(event, key)}
            style={{
              marginLeft: index === 0 ? marginHorizontal : 0,
              marginRight: index === data.length - 1 ? marginHorizontal : 0,
            }}
          >
            {renderItem({ item, key, isActive, index })}
          </View>
        )
      })}

      <Animated.View style={[styles.activeTabIndicator, { position: 'absolute', bottom: 0 }, activeIndicatorStyle]} />
    </Animated.ScrollView>
  )
}

export default TabButtonList

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    tabButtonsContainer: {
      gap: TAB_SPACING,
    },
    tabButtonsContainer_centered: {
      minWidth: '100%',
      justifyContent: 'center',
    },
    activeTabIndicator: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.foreground30,
    },
  })
