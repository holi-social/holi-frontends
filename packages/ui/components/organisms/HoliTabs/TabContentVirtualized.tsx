import React from 'react'
import { View } from 'react-native'

import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'

import { HoliTabsProps } from './types'

interface Props<D>
  extends Omit<
    HoliTabsProps<D>,
    'centeredTabButtons' | 'renderTabContent' | 'renderTabButton' | 'onChange' | 'variant'
  > {
  renderItem: HoliTabsProps<D>['renderTabContent']
  width: number
  marginHorizontal?: number
  tabsId: string
}

const TabContentVirtualized = <D,>({
  data,
  keyExtractor,
  renderItem,
  activeTab,
  marginHorizontal = 0,
  width: componentWidth,
  testID = 'holi-tabs-content-list',
  tabsId,
}: Props<D>) => {
  const activeTabIndex = data.findIndex((item) => keyExtractor(item) === activeTab)
  const activeTabData = data[activeTabIndex]

  return (
    <HoliTransition.FadeDownSwitch animKey={keyExtractor(activeTabData)}>
      <View
        testID={testID}
        role="tabpanel"
        id={`${tabsId}-panel-${activeTab}`}
        style={{ marginHorizontal, width: componentWidth - marginHorizontal * 2, zIndex: 10 }}
      >
        {renderItem({
          item: activeTabData,
          key: keyExtractor(activeTabData),
          isActive: true,
          index: activeTabIndex,
        })}
      </View>
    </HoliTransition.FadeDownSwitch>
  )
}

export default TabContentVirtualized
