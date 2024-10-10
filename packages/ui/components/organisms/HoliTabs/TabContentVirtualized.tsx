import React from 'react'
import Animated, { FadeInDown, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated'

import { HoliTabsProps } from './types'

interface Props<D>
  extends Omit<
    HoliTabsProps<D>,
    'centeredTabButtons' | 'renderTabContent' | 'renderTabButton' | 'onChange' | 'variant'
  > {
  renderItem: HoliTabsProps<D>['renderTabContent']
  width: number
  marginHorizontal?: number
}

const TabContentVirtualized = <D,>({
  data,
  keyExtractor,
  renderItem,
  activeTab,
  marginHorizontal = 0,
  width: componentWidth,
  testID = 'holi-tabs-content-list',
}: Props<D>) => {
  const activeTabIndex = data.findIndex((item) => keyExtractor(item) === activeTab)
  const activeTabData = data[activeTabIndex]

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        key={activeTab + '-content'}
        style={{ marginHorizontal, width: componentWidth - marginHorizontal * 2, zIndex: 10 }}
        entering={FadeInDown.delay(200)}
        exiting={FadeOutDown}
        testID={testID}
      >
        {renderItem({
          item: activeTabData,
          key: keyExtractor(activeTabData),
          isActive: true,
          index: activeTabIndex,
        })}
      </Animated.View>
    </LayoutAnimationConfig>
  )
}

export default TabContentVirtualized
