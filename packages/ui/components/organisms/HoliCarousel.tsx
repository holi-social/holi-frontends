import * as React from 'react'
import {
  NativeScrollEvent,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliCarouselProps = {
  slides: { title?: string; children: React.ReactNode }[]
  style?: StyleProp<ViewStyle>
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
  const defaultSlideWidth = 350
  const horizontalScrollMinWidth = 600

  const styles = getStyles(
    theme,
    screenWidth,
    marginHorizontal,
    marginBetweenSlides,
    defaultSlideWidth,
    horizontalScrollMinWidth
  )

  const handleScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (!nativeEvent?.contentOffset) return

    // Using Math.round means that when scrolling more than half of the slide width, it will move slides
    setCurrentSlide(Math.round(nativeEvent.contentOffset.x / scrollingOffset))
  }

  const goToSlide = (slide: number) => {
    if (!carousel || !carousel.current) {
      return
    }

    const scrollPoint = slide * scrollingOffset
    carousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })
    setCurrentSlide(slide)
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
          {slides.map((slide, slideIndex) => (
            <HoliButton
              label={slide.title || ''}
              transparent
              inline
              style={styles.slideButton}
              onPress={() => goToSlide(slideIndex)}
              key={slideIndex}
              accessibilityRole="tab"
              accessibilitySelected={slideIndex === currentSlide}
              accessibilityLabel={'' + slideIndex}
              testID={slideIndex === slideIndex ? 'active-tab' : 'inactive-tab'}
            >
              <View style={[styles.slideButtonIcon, slideIndex === currentSlide ? styles.activeSlideButtonIcon : {}]} />
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

const getStyles = (
  theme: HoliTheme,
  screenWidth: number,
  marginHorizontal: number,
  marginBetweenSlides: number,
  defaultSlideWidth: number,
  horizontalScrollMinWidth: number
) =>
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
      scrollSnapType: screenWidth < horizontalScrollMinWidth ? 'x mandatory' : 'none',
    },
    webSlideContainer: {
      scrollSnapAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      width: screenWidth < horizontalScrollMinWidth ? screenWidth - marginHorizontal * 2 : defaultSlideWidth,
      paddingLeft: marginBetweenSlides,
      paddingRight: 0,
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
    },
    firstSlideWeb: {
      paddingLeft: marginHorizontal + marginBetweenSlides,
    },
  })
