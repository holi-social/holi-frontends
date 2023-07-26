import React, { useMemo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { Platform, StyleSheet, Text, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import { HoliStepper, HoliStepperController, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface Tab {
  title: string
  children: React.ReactNode
  titleIcons?: [HoliIconType, HoliIconType]
  style?: StyleProp<ViewStyle>
}

interface Props {
  id: string
  initialStep?: number
  tabs: Tab[]
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

interface TabListProps {
  id: string
  testID?: string
  tabs: Tab[]
  centeredButtons?: boolean
  tabBarStyle?: StyleProp<ViewStyle>
}

const TabList: React.FC<TabListProps> = ({ id, testID, tabs, centeredButtons, tabBarStyle }) => {
  const mixins = useStyleMixins()
  const styles = getStyles(centeredButtons)

  const { setStep, currentStep } = useStepper()

  return (
    <View style={styles.headerContainer} accessibilityRole="tablist" accessibilityOrientation="horizontal">
      <View style={StyleSheet.flatten([mixins.container, styles.tabButtonsContainer, tabBarStyle])}>
        {tabs.map((tab, index) => {
          const isActive = currentStep === index
          return (
            <HoliTabButton
              label={tab.title}
              id={`${id}-tab-${index}`}
              style={StyleSheet.flatten([styles.tabButton, isActive ? styles.activeTabButton : {}])}
              onPress={() => setStep(index)}
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
  )
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
  const styles = getStyles(centeredButtons)

  const renderedTabContents = useMemo(
    () =>
      tabs.map((tab, i) => (
        <View
          style={tab.style}
          accessibilityLabelledBy={`${id}-tab-${i}`}
          nativeID={`${id}-panel-${i}`}
          key={i}
          accessibilityRole={Platform.OS === 'web' ? 'tabpanel' : undefined}
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
        <TabList id={id} testID={testID} tabs={tabs} tabBarStyle={tabBarStyle} centeredButtons={centeredButtons} />

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
    stepperStyle: {
      alignItems: 'flex-start',
    },
  })

export default HoliTabs
