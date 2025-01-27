import React, { useState } from 'react'
import { Dimensions, View } from 'react-native'
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'

import TabContentVirtualized from '@holi/ui/components/organisms/HoliTabs/TabContentVirtualized'
import { useTheme } from '@holi/ui/styles/theme'

import BotomLineSeperator from './BotomLineSeperator'
import TabButtonList from './TabButtonList'
import TabContentList from './TabContentScrollableList'
import { renderTabButtonHelper, useHoliTabsMarginHorizontal } from './helpers'
import type { HoliTabItem, HoliTabsProps } from './types'

const HoliTabs = <D extends HoliTabItem>({
  data,
  keyExtractor,
  renderTabButton,
  renderTabContent,
  activeTab,
  onChange,
  variant = 'virtualized',
  centeredTabButtons = false,
  backgroundColor,
  testID = 'holi-tabs',
  marginHorizontal: propMarginHorizontal,
}: HoliTabsProps<D>) => {
  const { theme } = useTheme()

  const marginHorizontal = useHoliTabsMarginHorizontal()
  const finalMarginHorizontal = propMarginHorizontal ?? marginHorizontal

  const [componentWidth, setComponentWidth] = useState<number>(Dimensions.get('window').width)

  const activeTabIndex = data.findIndex((item) => keyExtractor(item) === activeTab)
  const getKeyByIndex = (index: number) => keyExtractor(data[index])

  const contentScrollOffsetX = useSharedValue(activeTabIndex * componentWidth)
  const onContentScroll = useAnimatedScrollHandler((event) => {
    contentScrollOffsetX.value = event.contentOffset.x
  })

  const isUserDrag = useSharedValue(false)
  const isScrollableVariant = variant === 'scrollable'

  return (
    <View
      onLayout={(event) => setComponentWidth(event.nativeEvent.layout.width)}
      style={{ minWidth: '100%' }}
      testID={testID}
    >
      <View style={{ backgroundColor: theme.colors.background10 }}>
        <BotomLineSeperator />
        <TabButtonList
          {...{
            activeTab,
            data,
            keyExtractor,
            centeredTabButtons,
            marginHorizontal: useHoliTabsMarginHorizontal(),
            width: componentWidth,
          }}
          renderItem={(options) =>
            renderTabButtonHelper({ options, renderFunc: renderTabButton, id: testID, onPress: onChange })
          }
          contentScrollOffsetX={isScrollableVariant && isUserDrag ? contentScrollOffsetX : undefined}
          testID={`${testID}-button-list`}
        />
      </View>

      <View style={{ backgroundColor }}>
        {isScrollableVariant ? (
          <TabContentList
            {...{ activeTab, data, keyExtractor, marginHorizontal: finalMarginHorizontal, width: componentWidth }}
            renderItem={renderTabContent}
            onScroll={onContentScroll}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => (isUserDrag.value = true)}
            onMomentumScrollEnd={() => {
              isUserDrag.value = false
              onChange(getKeyByIndex(Math.floor(contentScrollOffsetX.value / componentWidth)))
            }}
            tabsId={testID}
            testID={`${testID}-content-list`}
          />
        ) : (
          <TabContentVirtualized
            {...{ activeTab, data, keyExtractor, marginHorizontal: finalMarginHorizontal, width: componentWidth }}
            renderItem={renderTabContent}
            tabsId={testID}
            testID={`${testID}-content-list`}
          />
        )}
      </View>
    </View>
  )
}

export default HoliTabs
