import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Animated, Platform, type ScrollView, StyleSheet, View } from 'react-native'
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { delayAnimation } from '@holi/ui/helper'

interface HoliStepperContextType {
  stepCount: number
  currentStep: number
  setStep: (nextStep: number, animated?: boolean) => void
  goNext: () => void
  goBack: () => void
  finished: boolean
  setFinished: (value: boolean) => void
}

const HoliStepperContext = createContext<HoliStepperContextType | null>(null)

interface HoliStepperProps extends ScrollViewProps {
  steps: React.ReactNode[]
  lazy?: boolean
  style?: StyleProp<ViewStyle>
  scrollEnabled?: boolean
}

interface HoliStepperControllerProps extends React.PropsWithChildren {
  stepCount: number
  initialStep?: number
  onChangeTab?: (index: number) => void
}

export const HoliStepperController: React.FC<HoliStepperControllerProps> = ({
  stepCount,
  initialStep = 0,
  onChangeTab,
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [finished, setFinished] = useState(false)
  const setStep = useCallback(
    (nextStep: number) => {
      const validNextStep = Math.min(Math.max(nextStep, 0), stepCount - 1)
      setCurrentStep(validNextStep)
      if (onChangeTab) onChangeTab(validNextStep)
    },
    [stepCount, onChangeTab]
  )
  const goBack = useCallback(() => setStep(currentStep - 1), [currentStep, setStep])
  const goNext = useCallback(() => setStep(currentStep + 1), [currentStep, setStep])

  useEffect(() => {
    if (currentStep !== initialStep) {
      setStep(initialStep)
    }
    // Apply effect _only_ if the initial step changed!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStep])

  const stepperContext = {
    stepCount,
    currentStep,
    setStep,
    goNext,
    goBack,
    finished,
    setFinished,
  }

  return <HoliStepperContext.Provider value={stepperContext}>{children}</HoliStepperContext.Provider>
}

export const useStepper = () => {
  const context = React.useContext(HoliStepperContext)
  return context as HoliStepperContextType
}

const scrollDelay = 33.332 // 1000 / 60fps * 2 to try to trigger on the second frame

/**
 * @deprecated Use HoliStepper from `@holi/packages/ui/components/organisms/HoliStepperV2` instead
 * @description The HoliStepper component is a controlled component, which means
 * the parent controls the element from the outside using the
 * HoliStepperContext.
 */
export const HoliStepper: React.FC<HoliStepperProps> = ({
  style,
  lazy = false,
  scrollEnabled,
  steps,
  ...scrollViewProps
}) => {
  const ref = useRef<ScrollView>(null)
  const [firstRender, setFirstRender] = useState(true)
  const renderedStepsRef = useRef<Map<number, boolean>>(new Map())
  const { currentStep, setStep } = useStepper()
  const [stepHeight, setStepHeight] = useState<number | undefined>(undefined)

  // Determine step width: start with window width and update on layout change
  const { width: windowWidth } = useClientWindowDimensions()
  const [viewWidth, setViewWidth] = useState(windowWidth)
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const width = Math.round(e.nativeEvent.layout.width)
    setViewWidth(width)
  }, [])

  const onStepLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      if (index === currentStep) {
        const height = Math.ceil(e.nativeEvent.layout.height)
        setStepHeight(height)
      }
    },
    [currentStep]
  )

  const updateCurrentStep = useCallback(
    (scrollPosition: number) => {
      const stepIndex = Math.round(scrollPosition / viewWidth)
      setStep(stepIndex)
    },
    [setStep, viewWidth]
  )

  // Update current step after scrolling on mobile
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      updateCurrentStep(event.nativeEvent.contentOffset.x)
    },
    [updateCurrentStep]
  )

  const scrollToStep = useCallback(
    (nextStep: number, animated = true) => {
      const scrollOptions = { x: nextStep * viewWidth, y: 0, animated: animated && !lazy }
      if (!ref.current?.scrollTo) {
        return
      }
      if (Platform.OS === 'android') {
        ref.current.scrollTo(scrollOptions)
      } else {
        delayAnimation(ref.current.scrollTo, scrollOptions, scrollDelay)
      }
    },
    [lazy, viewWidth]
  )

  useEffect(() => {
    scrollToStep(currentStep, !firstRender)
    if (firstRender) {
      setFirstRender(false)
    }
    // disable exhaustive deps because we don't want scroll again when `firstRender` is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, scrollToStep])

  const renderStep = (step: ReactNode, stepIndex: number) => {
    if (!lazy) return step

    const renderedSteps = renderedStepsRef.current

    steps.forEach((_, idx) => {
      const isRenderedStep = renderedSteps.get(idx)
      if (isRenderedStep) return

      renderedSteps.set(idx, currentStep === idx)
    })

    return stepIndex === currentStep || (scrollEnabled && renderedSteps.get(stepIndex)) ? step : null
  }

  return (
    <Animated.ScrollView
      ref={ref}
      keyboardShouldPersistTaps="always"
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollViewContainer, style]}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      testID="stepper-scrollview"
      bounces={false}
      scrollEventThrottle={16}
      horizontal
      pagingEnabled={scrollEnabled}
      onLayout={handleLayout}
      onMomentumScrollEnd={onMomentumScrollEnd}
      {...scrollViewProps}
    >
      {steps.map((step, idx) => {
        const isActive = idx === currentStep
        return (
          <View
            key={idx}
            style={StyleSheet.flatten([
              styles.stepWrapper,
              {
                width: viewWidth ? viewWidth : '100%',
                height: isActive ? 'auto' : stepHeight,
              },
            ])}
            testID="stepper-step"
            onLayout={onStepLayout(idx)}
          >
            {renderStep(step, idx)}
          </View>
        )
      })}
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  stepWrapper: {
    width: '100%',
  },
})
