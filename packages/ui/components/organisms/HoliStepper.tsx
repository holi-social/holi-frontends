import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import type { ScrollViewProps } from 'react-native'

import { delayAnimation } from '@holi/ui/helper'

interface StepperController {
  stepperRef: RefObject<ScrollView>
  currentStep: number
  setStep: (nextStep: number, animated?: boolean) => void
  goNext: () => void
  goBack: () => void
}

// TODO: refactor animation without using ScrollView, because it is not reliable on all platforms
// till then disable animation for HoliStepper
const isAnimated = false

/**
 * @description The HoliStepper component is a controlled component, which means
 * the parent controls the element from the outside with the `useStepper` hook.
 * It requires a `width` for the children of the Stepper. Depending on your
 * layout requirements, the `width` can be a Device, Screen, or View width.
 */
export const useStepper = (width: number, initialStep = 0): StepperController => {
  const delay = 33.332 // 1000 / 60fps * 2 to try to trigger on the second frame

  const ref = useRef<ScrollView>(null)
  const [currentStep, setCurrentStep] = useState(initialStep)

  const scrollPoint = useRef(0)

  const handleNextStep = useCallback(
    (nextStep: number, animated = isAnimated) => {
      scrollPoint.current = nextStep * width
      const scrollOptions = { x: scrollPoint.current, y: 0, animated }
      if (!ref.current?.scrollTo) return nextStep
      delayAnimation(ref.current.scrollTo, scrollOptions, delay)

      return nextStep
    },
    [width]
  )

  const goNext = useCallback(() => {
    setCurrentStep((current) => handleNextStep(current + 1))
  }, [handleNextStep])

  const goBack = useCallback(() => {
    setCurrentStep((current) => handleNextStep(Math.max(current - 1, 0)))
  }, [handleNextStep])

  const setStep = useCallback(
    (nextStep: number, animated = isAnimated) => {
      setCurrentStep(handleNextStep(nextStep, animated))
    },
    [handleNextStep]
  )

  // scroll once to `initialStep` without animation
  useEffect(() => {
    handleNextStep(initialStep, false)
    // disable eslint because we want it to be done only once on init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    stepperRef: ref,
    setStep,
    currentStep,
    goNext,
    goBack,
  }
}

interface Props extends ScrollViewProps {
  steps: React.ReactNode[]
  currentStep: number
  width: number
  lazy?: boolean
  backgroundColor?: string
  scrollEnabled?: boolean
}

export const HoliStepper = forwardRef<ScrollView, Props>(
  (
    { backgroundColor, steps, currentStep, width, lazy = false, scrollEnabled = isAnimated, ...scrollViewProps },
    carouselRef
  ) => {
    const renderedStepsRef = useRef<Map<number, boolean>>(new Map())

    const renderStep = (step: ReactNode, stepIdx: number) => {
      if (!lazy) return step

      const renderedSteps = renderedStepsRef.current

      steps.forEach((_, idx) => {
        const isRenderedStep = renderedSteps.get(idx)
        if (isRenderedStep) return

        renderedSteps.set(idx, currentStep === idx)
      })

      return stepIdx === currentStep || (scrollEnabled && renderedSteps.get(stepIdx)) ? step : null
    }

    const backgroundColorStyle = backgroundColor ? { backgroundColor: backgroundColor } : null

    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        ref={carouselRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
        showsHorizontalScrollIndicator={false}
        dataSet={{ stepperWrapper: true }}
        scrollEnabled={scrollEnabled}
        testID="stepper-scrollview"
        bounces={false}
        scrollEventThrottle={16}
        horizontal
        pagingEnabled
        {...scrollViewProps}
      >
        {steps.map((step, idx) => (
          <View
            key={idx}
            style={StyleSheet.flatten([styles.tabWrapper, backgroundColorStyle, { width: width }])}
            testID="stepper-step"
            dataSet={{ stepperStep: true }}
          >
            {renderStep(step, idx)}
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
    height: '100%',
    minHeight: '100%',
    ...Platform.select({
      web: {
        // Setting scrollEnabled in the ScrollView makes touch-action: none on web mobile, and you can't scroll vertically.
        // Hence the overflowX below.
        overflowX: 'hidden',
      },
    }),
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  tabWrapper: {
    flex: 1,
    width: '100%',
  },
})
