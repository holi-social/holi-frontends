import React, { useMemo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliStepper, HoliStepperController, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import HoliTabBar, { type Tab, TabListProps } from '@holi/ui/components/organisms/HoliTabBar'

interface TabItem extends Tab {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

interface Props {
  id: string
  initialStep?: number
  tabs: TabItem[]
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

const Tabs = (props: TabListProps) => {
  const { setStep, currentStep } = useStepper()
  return <HoliTabBar {...props} selectedTabId={currentStep} onPress={(tabId) => setStep(+tabId)} />
}

const HoliTabs = ({
  id,
  tabs,
  initialStep = 0,
  centeredButtons,
  style,
  tabBarStyle,
  onChangeTab,
  backgroundColor,
  testID = 'tabs-module',
  scrollEnabled = true,
  lazy = false,
}: Props) => {
  const renderedTabContents = useMemo(
    () =>
      tabs.map((tab, i) => (
        <View
          style={tab.style}
          aria-labelledby={`${id}-tab-${i}`}
          id={`${id}-panel-${i}`}
          key={i}
          role={Platform.OS === 'web' ? 'tabpanel' : undefined}
        >
          {tab.children}
        </View>
      )),
    [tabs, id]
  )
  const backgroundColorStyle = backgroundColor ? { backgroundColor: backgroundColor } : null

  return (
    <HoliStepperController stepCount={renderedTabContents.length} initialStep={initialStep} onChangeTab={onChangeTab}>
      <View style={StyleSheet.flatten([styles.holiTabs, style])} testID={testID}>
        <Tabs id={id} testID={testID} tabs={tabs} tabBarStyle={tabBarStyle} centeredButtons={centeredButtons} />

        <HoliStepper
          steps={renderedTabContents}
          style={[styles.stepperStyle, backgroundColorStyle]}
          scrollEnabled={scrollEnabled}
          lazy={lazy}
        />
      </View>
    </HoliStepperController>
  )
}

const styles = StyleSheet.create({
  holiTabs: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
  },
  stepperStyle: {
    alignItems: 'flex-start',
  },
})

export default HoliTabs
