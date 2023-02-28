import React, { useEffect } from 'react'
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import DataConsent from '@holi/core/auth/components/DataConsent'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'

const Onboarding: React.VFC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef<ScrollView>(null)
  const { onFinish } = useOnboarding()
  const { width: screenWidth } = useWindowDimensions()

  const goNext = () => setCurrentSlide((current) => current + 1)
  const goBack = () => setCurrentSlide((current) => current - 1)

  // this useEffect reacts on `currenctSlide` changes and adjusts `carousel` horizontal scroll position
  useEffect(() => {
    const scrollPoint = currentSlide * screenWidth
    carousel.current?.scrollTo({ x: scrollPoint, y: 0, animated: true })
  }, [currentSlide, screenWidth])

  return (
    <View style={styles.container}>
      <ScrollView
        ref={carousel}
        contentContainerStyle={styles.scrollViewContainer}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        bounces={false}
      >
        {/* Login-Registration-Continue as a Guest step */}
        <View style={styles.stepContainer}>
          <LoginRegistration
            onRegistration={goNext}
            onDismiss={onFinish}
            style={[styles.stepContent, { width: screenWidth }]}
          />
        </View>

        {/* Privacy Policy step */}
        <View style={styles.stepContainer}>
          <DataConsent onBackPress={goBack} style={[styles.stepContent, { width: screenWidth }]} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  stepContainer: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    ...Platform.select({
      native: {
        flexDirection: 'row',
      },
    }),
  },
  stepContent: {
    flex: 1,
  },
})

export default Onboarding
