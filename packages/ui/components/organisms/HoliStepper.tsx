import React, { forwardRef, useCallback, useState } from 'react'
import type { RefObject } from 'react'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import type { ScrollViewProps } from 'react-native'

import { useDelayedAnimation } from '@holi/ui/helper'

interface StepperController {
  stepperRef: RefObject<ScrollView>
  currentStep: number
  setStep: (nextStep: number) => void
  goNext: () => void
  goBack: () => void
}

export const useStepper = (screenWidth: number, initialStep = 0): StepperController => {
  const delay = 33.332 // 1000 / 60fps * 2 to try to trigger on the second frame

  const ref = React.useRef<ScrollView>(null)
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [scrollToStep] = useDelayedAnimation((position: number) => {
    ref.current?.scrollTo({ x: position, y: 0, animated: true })
  })

  const handleNextStep = useCallback(
    (nextStep: number) => {
      const scrollPoint = nextStep * screenWidth
      scrollToStep(scrollPoint, delay)

      return nextStep
    },
    [screenWidth, scrollToStep]
  )

  const goNext = useCallback(() => {
    setCurrentStep((current) => handleNextStep(current + 1))
  }, [handleNextStep])

  const goBack = useCallback(() => {
    setCurrentStep((current) => handleNextStep(Math.max(current - 1, 0)))
  }, [handleNextStep])

  const setStep = useCallback(
    (nextStep: number) => {
      handleNextStep(nextStep)
    },
    [handleNextStep]
  )

  return {
    stepperRef: ref,
    setStep,
    currentStep,
    goNext,
    goBack,
  }
}

export interface HoliStepperProps extends ScrollViewProps {
  steps: React.ReactNode[]
  currentStep: number
  screenWidth: number
  lazy?: boolean
}

export const HoliStepper = forwardRef<ScrollView, HoliStepperProps>(
  ({ steps, currentStep, screenWidth, lazy = false, ...scrollViewProps }, carouselRef) => {
    const mustStepBeRendered = (stepIdx: number) => {
      if (!lazy) return true
      return stepIdx === currentStep
    }

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
        scrollEnabled // Necessary on Safari for scroll animations
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
)

HoliStepper.displayName = 'HoliStepper'

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
