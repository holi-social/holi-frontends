import * as React from 'react'
import { NativeScrollEvent, Platform, ScrollView, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliCarouselProps = {
  slides: { title?: string; children: React.ReactNode }[]
  style?: (ViewStyle | Record<string, unknown> | undefined) | (ViewStyle | Record<string, unknown> | undefined)[]
}

const HoliCarousel: React.FunctionComponent<HoliCarouselProps> = ({ slides, style }: HoliCarouselProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef<ScrollView | null>(null)

  const isWeb = Platform.OS === 'web'

  const { width: screenWidth } = useWindowDimensions()

  const { theme } = useTheme()

  const marginHorizontal = 24 // margin between slide and device screen
  const marginBetweenSlides = 8 // margin between slides
  const scrollingOffset = screenWidth - (marginHorizontal * 2 - marginBetweenSlides)

  const styles = getStyles(theme, screenWidth, marginHorizontal, marginBetweenSlides)

  const handleScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (!nativeEvent || !nativeEvent.contentOffset) {
      return
    }
    // Using Math.round means that when scrolling more than half of the slide width, it will move slides
    setCurrentSlide(Math.round(nativeEvent.contentOffset.x / scrollingOffset))
  }

  const goToIndex = (index: number) => {
    if (!carousel || !carousel.current) {
      return
    }

    const scrollPoint = index * scrollingOffset
    carousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })
    setCurrentSlide(index)
  }

  return (
    <View style={[styles.container, style]}>
      {!isWeb && (
        <ScrollView
          ref={carousel}
          contentContainerStyle={styles.scrollViewContainerStyle}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={scrollingOffset}
          decelerationRate={0}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {slides.map((slide, i) => (
            <View
              style={[
                styles.slideContainer,
                i === 0 ? styles.firstSlideContainer : {},
                i === slides.length - 1 ? styles.lastSlideContainer : {},
              ]}
              key={i}
            >
              {slide.children}
            </View>
          ))}
        </ScrollView>
      )}

      {!isWeb && (
        <View style={styles.slideButtonsContainer} accessibilityRole="tablist" accessibilityOrientation="horizontal">
          {slides.map((slide, index) => (
            <HoliButton
              label={slide.title || ''}
              transparent
              inline
              style={styles.slideButton}
              onPress={() => goToIndex(index)}
              key={index}
              accessibilityRole="tab"
              accessibilitySelected={currentSlide === index}
              accessibilityLabel={'' + index}
              testID={currentSlide === index ? 'active-tab' : 'inactive-tab'}
            >
              <View style={[styles.slideButtonIcon, currentSlide === index ? styles.activeSlideButtonIcon : {}]}></View>
            </HoliButton>
          ))}
        </View>
      )}

      {isWeb && (
        <View style={styles.webView}>
          {slides.map((slide, i) => (
            <View
              style={[
                styles.webSlideContainer,
                i === 0 ? styles.firstSlideWeb : {},
                i === slides.length - 1 ? styles.lastSlideContainer : {},
              ]}
              key={i}
            >
              {slide.children}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default HoliCarousel

const getStyles = (theme: HoliTheme, screenWidth: number, marginHorizontal: number, marginBetweenSlides: number) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    scrollViewContainerStyle: {
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      width: screenWidth - marginHorizontal * 2,
      marginLeft: marginBetweenSlides,
      marginRight: 0,
    },
    firstSlideContainer: {
      marginLeft: marginHorizontal,
    },
    lastSlideContainer: {
      marginRight: marginHorizontal,
    },
    slideButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: 24,
    },
    slideButton: {
      marginHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideButtonIcon: {
      width: 8,
      height: 8,
      backgroundColor: theme.colors.softblack,
      opacity: 0.3,
      borderRadius: 50,
    },
    activeSlideButtonIcon: {
      backgroundColor: theme.colors.fontColor,
      opacity: 1,
    },
    webView: {
      overflowX: 'scroll',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      scrollSnapType: screenWidth < 600 ? 'x mandatory' : 'none',
    },
    webSlideContainer: {
      scrollSnapAlign: 'start',
      display: 'flex',
      flexDirection: 'row',
      width: screenWidth < 600 ? screenWidth - marginHorizontal * 2 : 350,
      paddingLeft: marginBetweenSlides,
      paddingRight: 0,
    },
    firstSlideWeb: {
      paddingLeft: marginHorizontal + marginBetweenSlides,
    },
  })
