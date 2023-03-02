import React, { useCallback, useEffect, useRef } from 'react'
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
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  stepContainerStyle?: StyleProp<ViewStyle>
}

export const HoliStepper: React.VFC<HoliStepperProps> = ({
  steps,
  currentStep = 0,
  style,
  contentContainerStyle,
  stepContainerStyle,
  ...scrollViewProps
}) => {
  const carousel = React.useRef<ScrollView>(null)
  const { width: screenWidth } = useWindowDimensions()
  const firstUpdate = useRef(true)

  // this useEffect reacts on `currenctStep` changes and adjusts `carousel` horizontal scroll position
  useEffect(() => {
    let timeout = 0

    // this workaround is for Web version. ScrollView has a bug and does not scroll correctly on initial rendering
    // so in Web on initial rendering only when "currentStep > 0" we wait after 600ms for next Animation Frame and scroll the ScrollView
    if (Platform.OS === 'web' && firstUpdate.current) {
      firstUpdate.current = false
      timeout = 600
    }

    const scrollPoint = currentStep * screenWidth

    setTimeout(
      () => requestAnimationFrame(() => carousel.current?.scrollTo({ x: scrollPoint, y: 0, animated: true })),
      timeout
    )
  }, [currentStep, screenWidth])

  return (
    <ScrollView
      ref={carousel}
      contentContainerStyle={[styles.scrollViewContainer, contentContainerStyle]}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={[styles.scrollView, style]}
      {...scrollViewProps}
    >
      {steps.map((step, idx) => (
        <View style={[styles.tabWrapper, stepContainerStyle]} key={idx}>
          {step}
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
