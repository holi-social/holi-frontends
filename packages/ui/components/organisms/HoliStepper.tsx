import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Animated, Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { delayAnimation, useSettle } from '@holi/ui/helper'

interface HoliStepperContextType {
  stepCount: number
  currentStep: number
  setStep: (nextStep: number, animated?: boolean) => void
  goNext: () => void
  goBack: () => void
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
  const setStep = useCallback(
    (nextStep: number) => {
      const validNextStep = Math.min(Math.max(nextStep, 0), stepCount - 1)
      setCurrentStep(validNextStep)
      onChangeTab && onChangeTab(validNextStep)
    },
    [stepCount, onChangeTab]
  )
  const goBack = useCallback(() => setStep(currentStep - 1), [currentStep, setStep])
  const goNext = useCallback(() => setStep(currentStep + 1), [currentStep, setStep])
  const stepperContext = {
    stepCount,
    currentStep,
    setStep,
    goNext,
    goBack,
  }

  return <HoliStepperContext.Provider value={stepperContext}>{children}</HoliStepperContext.Provider>
}

export const useStepper = () => {
  const context = React.useContext(HoliStepperContext)
  return context as HoliStepperContextType
}

const scrollDelay = 33.332 // 1000 / 60fps * 2 to try to trigger on the second frame

/**
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
  const scrollX = useRef(new Animated.Value(0)).current
  const { currentStep, setStep } = useStepper()

  // Determine step width: start with window width and update on layout change
  const { width: windowWidth } = useWindowDimensions()
  const [viewWidth, setViewWidth] = useState(windowWidth)
  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width
    setViewWidth(width)
  }

  const updateCurrentStep = useCallback(
    (scrollPosition: number) => {
      const stepIndex = Math.round(scrollPosition / viewWidth)
      setStep(stepIndex)
    },
    [setStep, viewWidth]
  )
  // For web: wait until the  scrollposition has not changed for a moment before
  // updating the current step
  const settledUpdate = useSettle(updateCurrentStep, 400)

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
      Platform.OS === 'android'
        ? ref.current.scrollTo(scrollOptions)
        : delayAnimation(ref.current.scrollTo, scrollOptions, scrollDelay)
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

  const onScrollWeb = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      settledUpdate(event.nativeEvent.contentOffset.x)
    },
    [settledUpdate]
  )
  const onScrollMobile = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  )

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
      onScroll={Platform.OS === 'web' ? onScrollWeb : onScrollMobile}
      onLayout={handleLayout}
      onMomentumScrollEnd={onMomentumScrollEnd}
      {...scrollViewProps}
    >
      {steps.map((step, idx) => {
        return (
          <View key={idx} style={StyleSheet.flatten([styles.tabWrapper, { width: viewWidth }])} testID="stepper-step">
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
