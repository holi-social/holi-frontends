import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import { useSafeFunctionThrottle } from '@holi/ui/helper'

export const useStepper = (initialStep = 0) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep)

  const goNext = useCallback(() => setCurrentStep((current) => current + 1), [])
  const goBack = useCallback(() => setCurrentStep((current) => current - 1), [])

  return {
    currentStep,
    setStep: setCurrentStep,
    goNext,
    goBack,
  }
}

export interface HoliStepperProps extends ScrollViewProps {
  steps: React.ReactNode[]
  currentStep: number
  lazy?: boolean
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  stepContainerStyle?: StyleProp<ViewStyle>
}

export const HoliStepper: React.VFC<HoliStepperProps> = ({
  steps,
  currentStep = 0,
  lazy = false,
  style,
  contentContainerStyle,
  stepContainerStyle,
  scrollEnabled = false,
  ...scrollViewProps
}) => {
  const carousel = React.useRef<ScrollView>(null)
  const { width: screenWidth } = useWindowDimensions()
  const firstUpdate = useRef(true)
  const [previousStep, setPreviousStep] = useState(currentStep)
  const { run: scrollToStep } = useSafeFunctionThrottle((position: number) => {
    carousel.current?.scrollTo({ x: position, y: 0, animated: true })
    // reset previousStep after scroll animation
    setTimeout(() => setPreviousStep(currentStep), 700)
  })
  const mustStepBeRendered = (stepIdx: number) => {
    if (!lazy) return true
    return stepIdx === currentStep || stepIdx === previousStep
  }

  // this useEffect reacts on `currenctStep` changes and adjusts `carousel` horizontal scroll position
  useEffect(() => {
    if (!firstUpdate.current && currentStep === previousStep) return

    let timeout = 0

    // this workaround is for Web version. ScrollView has a bug and does not scroll correctly on initial rendering
    // so in Web on initial rendering only when "currentStep > 0" we wait after 600ms for next Animation Frame and scroll the ScrollView
    if (Platform.OS === 'web' && firstUpdate.current) {
      firstUpdate.current = false
      timeout = 600
    }
    const scrollPoint = currentStep * screenWidth
    scrollToStep(scrollPoint, timeout)
  }, [currentStep, previousStep, screenWidth, scrollToStep])

  return (
    <ScrollView
      ref={carousel}
      style={[styles.scrollView, style]}
      contentContainerStyle={[styles.scrollViewContainer, contentContainerStyle]}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      // 'scrollEnabled' must be 'true' for scroll animation on Safari
      scrollEnabled={currentStep !== previousStep || scrollEnabled}
      {...scrollViewProps}
    >
      {steps.map((step, idx) => (
        <View style={[styles.tabWrapper, { width: screenWidth }, stepContainerStyle]} key={idx} testID="stepper-step">
          {mustStepBeRendered(idx) && step}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    ...Platform.select({
      native: {
        flexDirection: 'row',
      },
    }),
  },
  scrollViewContainer: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  tabWrapper: {
    flex: 1,
  },
})
