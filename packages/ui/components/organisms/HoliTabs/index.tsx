import React, { useState } from 'react'
import { Dimensions, View } from 'react-native'
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'

import { useTheme } from '@holi/ui/styles/theme'

import BotomLineSeperator from './BotomLineSeperator'
import TabButtonList from './TabButtonList'
import TabContentList from './TabContentList'
import { renderTabButtonHelper, useHoliTabsMarginHorizontal } from './helpers'
import { HoliTabItem, HoliTabsProps } from './types'

const HoliTabs = <D extends HoliTabItem>({
  data,
  keyExtractor,
  renderTabButton,
  renderTabContent,
  activeTab,
  onChange,
  centeredTabButtons = false,
  backgroundColor,
  testID = 'holi-tabs',
}: HoliTabsProps<D>) => {
  const { theme } = useTheme()

  const [componentWidth, setComponentWidth] = useState<number>(Dimensions.get('window').width)

  const activeTabIndex = data.findIndex((item) => keyExtractor(item) === activeTab)
  const getKeyByIndex = (index: number) => keyExtractor(data[index])

  const contentScrollOffsetX = useSharedValue(activeTabIndex * componentWidth)
  const onContentScroll = useAnimatedScrollHandler((event) => {
    contentScrollOffsetX.value = event.contentOffset.x
  })

  const marginHorizontal = useHoliTabsMarginHorizontal()

  const isUserDrag = useSharedValue(false)

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
            marginHorizontal,
            width: componentWidth,
          }}
          renderItem={(options) =>
            renderTabButtonHelper({ options, renderFunc: renderTabButton, id: testID, onPress: onChange })
          }
          contentScrollOffsetX={isUserDrag && contentScrollOffsetX}
          testID={`${testID}-button-list`}
        />
      </View>

      <View style={{ backgroundColor }}>
        <TabContentList
          {...{ activeTab, data, keyExtractor, marginHorizontal, width: componentWidth }}
          renderItem={renderTabContent}
          onScroll={onContentScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => (isUserDrag.value = true)}
          onMomentumScrollEnd={() => {
            isUserDrag.value = false
            onChange(getKeyByIndex(Math.floor(contentScrollOffsetX.value / componentWidth)))
          }}
          testID={`${testID}-content-list`}
        />
      </View>
    </View>
  )
}

export default HoliTabs
