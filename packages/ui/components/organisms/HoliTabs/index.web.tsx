import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'
import { useAnimatedScrollHandler } from 'react-native-reanimated'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import TabContentVirtualized from '@holi/ui/components/organisms/HoliTabs/TabContentVirtualized'
import { useTheme } from '@holi/ui/styles/theme'

import BotomLineSeperator from './BotomLineSeperator'
import TabButtonList from './TabButtonList'
import TabContentList from './TabContentScrollableList'
import { renderTabButtonHelper, useHoliTabsMarginHorizontal } from './helpers'
import { HoliTabItem, HoliTabsProps } from './types'

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
}: HoliTabsProps<D>) => {
  const { theme } = useTheme()

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

  const marginHorizontal = useHoliTabsMarginHorizontal()

  return (
    <View testID={testID} style={{ flex: 1 }}>
      <View style={{ backgroundColor: theme.colors.background10 }}>
        <BotomLineSeperator />

        <HoliContainer noPadding>
          <View onLayout={(event) => setComponentWidth(event.nativeEvent.layout.width)} />
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
              {...{ activeTab, data, keyExtractor, marginHorizontal, width: componentWidth }}
              renderItem={renderTabContent}
              onScroll={onContentScroll}
              scrollEventThrottle={100}
              tabsId={testID}
              testID={`${testID}-content-list`}
            />
          ) : (
            <TabContentVirtualized
              {...{ activeTab, data, keyExtractor, marginHorizontal, width: componentWidth }}
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
