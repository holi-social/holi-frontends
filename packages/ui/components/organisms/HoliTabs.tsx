import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface Props {
  id: string
  initialStep?: number
  tabs: { title: string; children: React.ReactNode; titleIcon?: string; style?: StyleProp<ViewStyle> }[]
  centeredButtons?: boolean
  onChangeTab?: (index: number) => void
  style?: StyleProp<ViewStyle>
  testID?: string
  tabBarWidth?: number
  tabBarStyle?: StyleProp<ViewStyle>
  stepper?: boolean
  backgroundColor?: string
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
  stepper = true,
}: Props) => {
  const [viewWidth, setViewWidth] = useState(750)
  const { currentStep, setStep, stepperRef, scrollEnabled, onScroll } = useStepper(viewWidth, initialStep)
  const [activeTab, setActiveTab] = useState(currentStep)
  const mixins = useStyleMixins()
  const styles = getStyles(centeredButtons)

  const handleTabChange = useCallback(
    (index: number) => {
      setActiveTab(index)
      setStep(index)
    },
    [setStep]
  )

  // TODO - Handle state changes in one handler
  useEffect(() => {
    handleTabChange(currentStep)
    onChangeTab?.(currentStep)
  }, [currentStep, onChangeTab, handleTabChange])

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
        >
          {tab.children}
        </View>
      )),
    [tabs, testID, currentStep, id]
  )

  return (
    <View style={StyleSheet.flatten([styles.holiTabs, style])} testID={testID}>
      <View style={styles.headerContainer} accessibilityRole="tablist" accessibilityOrientation="horizontal">
        <View style={StyleSheet.flatten([mixins.container, styles.tabButtonsContainer, tabBarStyle])}>
          {tabs.map((tab, index) => {
            const isActive = activeTab === index
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
                {!!tab.titleIcon && (
                  <HoliIcon
                    icon={tab.titleIcon}
                    size={22}
                    color={isActive ? colors.foreground30 : colors.foreground20}
                    style={styles.tabButtonIcon}
                    filled={isActive}
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

      {stepper ? (
        <HoliStepper
          ref={stepperRef}
          currentStep={currentStep}
          width={viewWidth}
          steps={renderedTabs}
          scrollEnabled={scrollEnabled}
          onScroll={onScroll}
          onLayout={handleLayout}
          backgroundColor={backgroundColor}
        />
      ) : (
        renderedTabs
      )}
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
