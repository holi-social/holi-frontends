import React, { useCallback, useEffect } from 'react'
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

  // this useEffect reacts on `currenctStep` changes and adjusts `carousel` horizontal scroll position
  useEffect(() => {
    const scrollPoint = currentStep * screenWidth
    carousel.current?.scrollTo({ x: scrollPoint, y: 0, animated: true })
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
