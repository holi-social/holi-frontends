import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Animated, Platform, ScrollView, StyleSheet, View } from 'react-native'
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollViewProps } from 'react-native'

import { useDebounce } from '@holi/ui/helper'
import { delayAnimation } from '@holi/ui/helper'

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
  width: number
  lazy?: boolean
  backgroundColor?: string
  scrollEnabled?: boolean
}

interface HoliStepperWrapperProps extends React.PropsWithChildren {
  stepCount: number
  initialStep?: number
  onChangeTab?: (index: number) => void
}

// TODO(SF) rename to HoliStepperContextProvider or something similiar
// ooor HoliStepper and the other one HoliStepperContent or whatever
export const HoliStepperWrapper: React.FC<HoliStepperWrapperProps> = ({
  stepCount,
  initialStep = 0,
  onChangeTab,
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const setStep = useCallback(
    (nextStep: number) => {
      const validNextStep = Math.min(Math.max(nextStep, 0), stepCount)
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

// TODO(SF) maybe improve naming?
export const useStepper = () => {
  const context = React.useContext(HoliStepperContext)
  return context as HoliStepperContextType
}

const scrollDelay = 33.332 // 1000 / 60fps * 2 to try to trigger on the second frame

/**
 * @description The HoliStepper component is a controlled component, which means
 * the parent controls the element from the outside using the
 * HoliStepperContext.
 * It requires a `width` for the children of the Stepper. Depending on your
 * layout requirements, the `width` can be a Device, Screen, or View width.
 */
export const HoliStepper: React.FC<HoliStepperProps> = ({
  backgroundColor,
  width,
  lazy = false,
  scrollEnabled,
  steps,
  ...scrollViewProps
}) => {
  const ref = useRef<ScrollView>(null)
  const [firstRender, setFirstRender] = useState(true)
  // TODO(SF) still needed?
  const renderedStepsRef = useRef<Map<number, boolean>>(new Map())
  const scrollX = useRef(new Animated.Value(0)).current
  // TODO(SF) do we really need this?
  const scrollPoint = useRef(0)
  const { currentStep, setStep } = useStepper()

  // TODO(SF) only necessary for web, but does not "feel" very good
  // => possibly disable scrolling on web
  useEffect(() => {
    const listener = scrollX.addListener((state) => {
      scrollPoint.current = state.value
    })

    return () => scrollX.removeListener(listener)
  }, [scrollX])
  const updateCurrentStep = useCallback(() => {
    const stepIndex = Math.round(scrollPoint.current / width)
    setStep(stepIndex)
  }, [setStep, width])
  const debouncedUpdate = useDebounce(updateCurrentStep, 1000)

  // // TODO(SF) only works on mobile
  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollPoint.current = event.nativeEvent.contentOffset.x
      updateCurrentStep()
    },
    [updateCurrentStep]
  )

  const scrollToStep = useCallback(
    (nextStep: number, animated = true) => {
      const scrollOptions = { x: nextStep * width, y: 0, animated }
      if (!ref.current?.scrollTo) {
        return
      }
      Platform.OS === 'android'
        ? ref.current.scrollTo(scrollOptions)
        : delayAnimation(ref.current.scrollTo, scrollOptions, scrollDelay)
    },
    [width]
  )

  useEffect(() => {
    scrollToStep(currentStep, !firstRender)
    if (firstRender) {
      setFirstRender(false)
    }
    // disable exhaustive deps because we don't want scroll again when `firstRender` is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, scrollToStep])

  const onScroll = Animated.event(
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

  const backgroundColorStyle = backgroundColor ? { backgroundColor: backgroundColor } : null

  return (
    <Animated.ScrollView
      ref={ref}
      keyboardShouldPersistTaps="always"
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollViewContainer, backgroundColorStyle]}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      testID="stepper-scrollview"
      bounces={false}
      scrollEventThrottle={16}
      horizontal
      pagingEnabled
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onResponderEnd={debouncedUpdate}
      // onResponderRelease={debouncedUpdate}
      {...scrollViewProps}
    >
      {steps.map((step, idx) => {
        const renderedStep = renderStep(step, idx)
        // TODO(SF) still not optimal => does not consider max rendered step?
        if (!renderedStep && idx > currentStep) {
          return null
        }
        return (
          <View key={idx} style={StyleSheet.flatten([styles.tabWrapper, { width: width }])} testID="stepper-step">
            {renderedStep}
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
    // TODO(SF) ?
    // ...Platform.select({
    //   web: {
    //     // Setting scrollEnabled in the ScrollView makes touch-action: none on web mobile, and you can't scroll vertically.
    //     // Hence the overflowX below.
    //     overflowX: 'hidden',
    //   },
    // }),
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  tabWrapper: {
    flex: 1,
    width: '100%',
  },
})
