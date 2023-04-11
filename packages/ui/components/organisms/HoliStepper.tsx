import React, { useCallback, useEffect, useState } from 'react'
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import type { ScrollViewProps } from 'react-native'

import { useDelayedAnimation } from '@holi/ui/helper'

export const useStepper = (initialStep = 0) => {
  const [currentStep, setCurrentStep] = useState(initialStep)

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
}

export const HoliStepper = ({ steps, currentStep, lazy = false, ...scrollViewProps }: HoliStepperProps) => {
  const carouselRef = React.useRef<ScrollView>(null)
  const { width: screenWidth } = useWindowDimensions()

  const [scrollToStep, cancelScrollToStep] = useDelayedAnimation((position: number) => {
    carouselRef.current?.scrollTo({ x: position, y: 0, animated: true })
  })

  const mustStepBeRendered = (stepIdx: number) => {
    if (!lazy) return true
    return stepIdx === currentStep
  }

  // This `useEffect` reacts on `currenctStep` changes and adjusts carousel
  // horizontal scroll position.
  useEffect(() => {
    const delay = 33.332 // 1000 / 60fps * 2 to try to trigger on the second frame
    const scrollPoint = currentStep * screenWidth

    scrollToStep(scrollPoint, delay)
    ;() => cancelScrollToStep
  }, [currentStep, screenWidth, scrollToStep, cancelScrollToStep])

  return (
    <ScrollView
      ref={carouselRef}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
      showsHorizontalScrollIndicator={false}
      dataSet={{ stepperWrapper: true }}
      bounces={false}
      {...scrollViewProps}
      horizontal
      pagingEnabled
      scrollEnabled // `scrollEnabled` is necessary for scroll animations on Safari
    >
      {steps.map((step, idx) => (
        <View
          key={idx}
          style={StyleSheet.flatten([styles.tabWrapper, { width: screenWidth }])}
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
