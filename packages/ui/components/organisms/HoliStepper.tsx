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

import { useDelayedAnimation } from '@holi/ui/helper'

export const useStepper = (initialStep = 0) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep)

  const goNext = useCallback(() => setCurrentStep((current) => current + 1), [])
  const goBack = useCallback(() => setCurrentStep((current) => Math.max(current - 1, 0)), [])

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
  const carouselRef = React.useRef<ScrollView>(null)
  const firstUpdate = useRef(true)

  const { width: screenWidth } = useWindowDimensions()
  const [previousStep, setPreviousStep] = useState(currentStep)

  const [scrollToStep, cancelScrollToStep] = useDelayedAnimation((position: number) => {
    carouselRef.current?.scrollTo({ x: position, y: 0, animated: !firstUpdate.current })
    // reset previousStep after scroll animation
    setTimeout(() => {
      firstUpdate.current = false
      setPreviousStep(currentStep)
    }, 700)
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
      timeout = 600
    }
    const scrollPoint = currentStep * screenWidth
    scrollToStep(scrollPoint, timeout)
    ;() => cancelScrollToStep
  }, [currentStep, previousStep, screenWidth, scrollToStep, cancelScrollToStep])

  return (
    <ScrollView
      ref={carouselRef}
      style={[styles.scrollView, style]}
      contentContainerStyle={[styles.scrollViewContainer, contentContainerStyle]}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      // 'scrollEnabled' must be 'true' for scroll animation on Safari
      scrollEnabled={currentStep !== previousStep || scrollEnabled}
      {...scrollViewProps}
      dataSet={{ stepperWrapper: true }}
    >
      {steps.map((step, idx) => (
        <View
          style={[styles.tabWrapper, { width: screenWidth }, stepContainerStyle]}
          key={idx}
          testID="stepper-step"
          dataSet={{ stepperStep: true }}
        >
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
