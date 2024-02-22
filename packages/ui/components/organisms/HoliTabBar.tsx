import React, { useCallback, useRef } from 'react'
import type { LayoutChangeEvent, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { Platform, StyleSheet, View } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
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

const isWeb = Platform.OS === 'web'
const TAB_SPACING = 20

const HoliTabBar: React.FC<TabListProps> = ({
  id,
  testID,
  tabs,
  selectedTabId = 0,
  centeredButtons,
  tabBarStyle,
  onPress,
}) => {
  const { width: screenWidth } = useClientWindowDimensions()
  const scrollViewRef = useRef<ScrollView | null>(null)
  // tab button width can be maximum 66% of the screen width
  const MAX_TAB_WIDTH = Math.max(screenWidth * 0.66, 320)

  const scrollIntoView = useCallback((event: LayoutChangeEvent) => {
    if (isWeb) return
    const { x } = event.nativeEvent.layout

    scrollViewRef.current?.scrollTo({
      x: Math.max(x - TAB_SPACING, 0),
      animated: true,
    })
  }, [])

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.botomLineSeperator} />
      <View style={tabBarStyle}>
        <HoliHorizontalScrollContainer hideWebScrollbars ref={scrollViewRef}>
          <View
            style={StyleSheet.flatten([
              styles.tabButtonsContainer,
              { justifyContent: centeredButtons ? 'center' : 'flex-start' },
            ])}
            role="tablist"
          >
            {tabs.map((tab, index) => {
              const tabId = tab.id ?? index
              const isActive = selectedTabId === tabId
              return (
                <View onLayout={isActive ? scrollIntoView : undefined} key={tabId}>
                  <HoliBox padding={[0, TAB_SPACING, 0, index === 0 ? TAB_SPACING : 0]}>
                    <HoliTabButton
                      label={tab.title}
                      id={`${id}-tab-${tabId}`}
                      style={StyleSheet.flatten([
                        styles.tabButton,
                        isActive && styles.activeTabButton,
                        { maxWidth: MAX_TAB_WIDTH },
                      ] as StyleProp<ViewStyle>)}
                      onPress={() => onPress?.(tabId)}
                      aria-selected={isActive}
                      aria-controls={`${id}-panel-${tabId}`}
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
                  </HoliBox>
                </View>
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
