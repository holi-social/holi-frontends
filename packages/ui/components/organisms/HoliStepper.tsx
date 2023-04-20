import React, { forwardRef, useCallback, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from 'react-native'

import { delayAnimation } from '@holi/ui/helper'

interface StepperController {
  stepperRef: RefObject<ScrollView>
  currentStep: number
  setStep: (nextStep: number) => void
  goNext: () => void
  goBack: () => void
  scrollEnabled: boolean
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

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
  // scrollEnabled=true prop on ScrollView is necessary on Safari for scroll animations
  // but like in Onboarding we want to prevent users of manually swiping of ScrollView and goind to another steps
  // so, we enable scroll only for a short time whe animation will happen
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const scrollPoint = useRef(0)

  const handleNextStep = useCallback(
    (nextStep: number) => {
      const scrollTo = ref.current?.scrollTo
      scrollPoint.current = nextStep * width
      const scrollOptions = { x: scrollPoint.current, y: 0, animated: true }
      setScrollEnabled(true) // enable scrolling for correct Safari animation
      if (!scrollTo) return nextStep
      delayAnimation(scrollTo, scrollOptions, delay)

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
    (nextStep: number) => {
      setCurrentStep(handleNextStep(nextStep))
    },
    [handleNextStep]
  )

  // `onScroll` is used to detect scroll animation end and disable `scrollEnabled`
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x
    if (scrollX === scrollPoint.current) {
      setScrollEnabled(false)
    }
  }, [])

  return {
    stepperRef: ref,
    setStep,
    currentStep,
    goNext,
    goBack,
    scrollEnabled,
    onScroll,
  }
}

interface Props extends ScrollViewProps {
  steps: React.ReactNode[]
  currentStep: number
  width: number
  lazy?: boolean
  backgroundColor?: string
}

export const HoliStepper = forwardRef<ScrollView, Props>(
  (
    { backgroundColor, steps, currentStep, width, lazy = false, scrollEnabled = true, ...scrollViewProps },
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

      return renderedSteps.get(stepIdx) ? step : null
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
        scrollEnabled={scrollEnabled} // Necessary to be `true` on Safari for scroll animations
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
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  tabWrapper: {
    flex: 1,
    width: '100%',
  },
})
