import React, { useState } from 'react'
import { View, type ViewStyle } from 'react-native'
import { useAnimatedScrollHandler } from 'react-native-reanimated'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import TabContentVirtualized from '@holi/ui/components/organisms/HoliTabs/TabContentVirtualized'
import { useTheme } from '@holi/ui/styles/theme'

import BottomLineSeperator from './BotomLineSeperator'
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
  tabBarBackgroundColor,
  testID = 'holi-tabs',
  marginHorizontal: propMarginHorizontal,
  hideTabs = false,
}: HoliTabsProps<D>) => {
  const { theme } = useTheme()

  const marginHorizontal = useHoliTabsMarginHorizontal()
  const finalMarginHorizontal = propMarginHorizontal ?? marginHorizontal

  const [componentWidth, setComponentWidth] = useState<number>(0)

  const activeTabIndex = data.findIndex((item) => keyExtractor(item) === activeTab)
  const getKeyByIndex = (index: number) => keyExtractor(data[index])

  const onContentScroll = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x
    const newActiveTabIndex = Math.round(event.contentOffset.x / componentWidth)
    const scrollFinished = offsetX % componentWidth === 0

    if (scrollFinished && activeTabIndex !== newActiveTabIndex) {
      onChange(getKeyByIndex(newActiveTabIndex))
    }
  })

  return (
    <View testID={testID} style={{ flex: 1 }}>
      <View
        style={
          {
            backgroundColor: tabBarBackgroundColor ?? theme.colors.background10,
            visibility: hideTabs ? 'hidden' : undefined,
          } as ViewStyle
        }
      >
        <BottomLineSeperator />

        <HoliContainer noPadding>
          <View onLayout={(event) => setComponentWidth(event.nativeEvent.layout.width)} />
          <TabButtonList
            {...{
              activeTab,
              data,
              keyExtractor,
              centeredTabButtons,
              marginHorizontal: finalMarginHorizontal,
              width: componentWidth,
            }}
            renderItem={(options) =>
              renderTabButtonHelper({ options, renderFunc: renderTabButton, id: testID, onPress: onChange })
            }
            testID={`${testID}-button-list`}
            // use `key` to reload the component when the width changes on resize
            key={`button-list-${componentWidth}`}
          />
        </HoliContainer>
      </View>

      <View
        style={[
          { flex: 1, backgroundColor },
          {
            opacity: componentWidth === 0 ? 0 : 1,
            transition: 'opacity 0.3s linear',
          } as ViewStyle,
        ]}
      >
        <HoliContainer noPadding>
          {variant === 'scrollable' ? (
            <TabContentList
              {...{ activeTab, data, keyExtractor, marginHorizontal: finalMarginHorizontal, width: componentWidth }}
              renderItem={renderTabContent}
              onScroll={onContentScroll}
              scrollEventThrottle={100}
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
        </HoliContainer>
      </View>
    </View>
  )
}

export default HoliTabs
