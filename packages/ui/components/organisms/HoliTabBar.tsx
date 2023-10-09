import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliHorizontalScrollContainer from '@holi/ui/components/atoms/HoliHorizontalScrollContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import { colors } from '@holi/ui/styles/globalVars'

export interface Tab {
  id?: string | number // ID is optional, if it is not passed tab's `index` in array will be used
  title: string
  titleIcons?: [HoliIconType, HoliIconType]
}

export interface TabListProps {
  id: string
  testID?: string
  tabs: Tab[]
  selectedTabId?: string | number
  onPress?: (tabId: string | number) => void
  centeredButtons?: boolean
  tabBarStyle?: StyleProp<ViewStyle>
}

const HoliTabBar: React.FC<TabListProps> = ({
  id,
  testID,
  tabs,
  selectedTabId = 0,
  centeredButtons,
  tabBarStyle,
  onPress,
}) => {
  const { width: screenWidth } = useWindowDimensions()

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.botomLineSeperator} />
      <View style={tabBarStyle}>
        <HoliHorizontalScrollContainer hideWebScrollbars>
          <View
            style={StyleSheet.flatten([
              styles.tabButtonsContainer,
              { justifyContent: centeredButtons ? 'center' : 'flex-start' },
            ])}
          >
            {tabs.map((tab, index) => {
              const tabId = tab.id ?? index
              const isActive = selectedTabId === tabId
              return (
                <HoliTabButton
                  label={tab.title}
                  id={`${id}-tab-${tabId}`}
                  style={StyleSheet.flatten([
                    styles.tabButton,
                    isActive && styles.activeTabButton,
                    {
                      // tab button width can be maximum 66% of the screen width
                      maxWidth: Math.min(screenWidth * 0.66, 320),
                      marginLeft: index === 0 ? 20 : 0,
                    },
                  ] as StyleProp<ViewStyle>)}
                  onPress={() => onPress?.(tabId)}
                  ariaSelected={isActive}
                  accessibilityControls={`${id}-panel-${tabId}`}
                  key={tabId}
                  testID={`${testID}-button-${tabId}-${isActive ? 'active' : 'inactive'}`}
                >
                  {!!tab.titleIcons && (
                    <HoliIcon
                      icon={isActive ? tab.titleIcons[1] : tab.titleIcons[0]}
                      size={22}
                      color={isActive ? colors.foreground30 : colors.foreground20}
                      style={styles.tabButtonIcon}
                    />
                  )}
                  <HoliText
                    bold={isActive}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={StyleSheet.flatten([styles.tabButtonText, isActive ? styles.activeTabButtonText : null])}
                  >
                    {tab.title}
                  </HoliText>
                </HoliTabButton>
              )
            })}
          </View>
        </HoliHorizontalScrollContainer>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  botomLineSeperator: {
    width: '100%',
    borderBottomColor: colors.background30,
    borderBottomWidth: 2,
    position: 'absolute',
    bottom: 0,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonIcon: {
    marginRight: 8,
  },
  tabButtonText: {
    fontSize: 16,
    color: colors.foreground20,
  },
  activeTabButton: {
    borderBottomColor: colors.foreground30,
  },
  activeTabButtonText: {
    color: colors.foreground30,
    fontWeight: '500',
  },
})

export default HoliTabBar
