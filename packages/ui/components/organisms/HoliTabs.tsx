import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, Platform, StyleSheet, Text, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface Props {
  id: string
  initialStep?: number
  tabs: {
    title: string
    children: React.ReactNode
    titleIcons?: [HoliIconType, HoliIconType]
    style?: StyleProp<ViewStyle>
  }[]
  centeredButtons?: boolean
  onChangeTab?: (index: number) => void
  style?: StyleProp<ViewStyle>
  testID?: string
  tabBarWidth?: number
  tabBarStyle?: StyleProp<ViewStyle>
  stepper?: boolean
  backgroundColor?: string
  scrollEnabled?: boolean
  lazy?: boolean
}

const HoliTabs = ({
  id,
  tabs,
  initialStep,
  centeredButtons,
  style,
  tabBarStyle,
  onChangeTab,
  backgroundColor,
  testID = 'tabs-module',
  scrollEnabled = true,
  lazy = false,
}: Props) => {
  const [viewWidth, setViewWidth] = useState(750)
  const { currentStep, setStep, stepperRef } = useStepper(viewWidth, initialStep)
  const mixins = useStyleMixins()
  const styles = getStyles(centeredButtons)

  const handleTabChange = useCallback((index: number) => setStep(index), [setStep])

  useEffect(() => {
    onChangeTab?.(currentStep)
  }, [currentStep, onChangeTab])

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width
    setViewWidth(width)
  }

  const renderedTabs = useMemo(
    () =>
      tabs.map((tab, i) => (
        <View
          style={tab.style}
          accessibilityLabelledBy={`${id}-tab-${i}`}
          nativeID={`${id}-panel-${i}`}
          testID={`${testID}-panel-${i}-${currentStep === i ? 'active' : 'inactive'}`}
          key={i}
          accessibilityRole={Platform.OS === 'web' ? 'tabpanel' : undefined}
        >
          {tab.children}
        </View>
      )),
    [tabs, testID, currentStep, id]
  )

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setStep(Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))
  }

  return (
    <View style={StyleSheet.flatten([styles.holiTabs, style])} testID={testID}>
      <View style={styles.headerContainer} accessibilityRole="tablist" accessibilityOrientation="horizontal">
        <View style={StyleSheet.flatten([mixins.container, styles.tabButtonsContainer, tabBarStyle])}>
          {tabs.map((tab, index) => {
            const isActive = currentStep === index
            return (
              <HoliTabButton
                label={tab.title}
                id={`${id}-tab-${index}`}
                style={StyleSheet.flatten([styles.tabButton, isActive ? styles.activeTabButton : {}])}
                onPress={() => handleTabChange(index)}
                key={index}
                accessibilitySelected={isActive}
                accessibilityControls={`${id}-panel-${index}`}
                testID={`${testID}-button-${index}-${isActive ? 'active' : 'inactive'}`}
              >
                {!!tab.titleIcons && (
                  <HoliIcon
                    icon={isActive ? tab.titleIcons[1] : tab.titleIcons[0]}
                    size={22}
                    color={isActive ? colors.foreground30 : colors.foreground20}
                    style={styles.tabButtonIcon}
                  />
                )}
                <Text style={StyleSheet.flatten([styles.tabButtonText, isActive ? styles.activeTabButtonText : null])}>
                  {tab.title}
                </Text>
              </HoliTabButton>
            )
          })}
        </View>
      </View>

      <HoliStepper
        ref={stepperRef}
        currentStep={currentStep}
        width={viewWidth}
        steps={renderedTabs}
        onLayout={handleLayout}
        backgroundColor={backgroundColor}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEnabled={scrollEnabled}
        lazy={lazy}
      />
    </View>
  )
}

const getStyles = (centeredButtons = false) =>
  StyleSheet.create({
    holiTabs: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignContent: 'center',
      width: '100%',
    },
    headerContainer: {
      width: '100%',
      borderBottomColor: colors.background30,
      borderBottomWidth: 2,
    },
    tabButtonsContainer: {
      flexDirection: 'row',
      justifyContent: centeredButtons ? 'center' : 'flex-start',
    },
    tabButton: {
      paddingVertical: 12,
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      borderBottomWidth: 2,
      top: 2, // must be the same value as the tabButtonsContainer borderWidth
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

export default HoliTabs
