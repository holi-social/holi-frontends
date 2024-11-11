import * as React from 'react'
import { NativeScrollEvent, Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface HoliCarouselProps {
  slides: { title?: string; children: React.ReactNode }[]
  style?: StyleProp<ViewStyle>
  hideDotIndicators?: boolean
  marginHorizontal?: number
  slideWidth?: number
}

const isWeb = Platform.OS === 'web'

const HoliCarousel: React.FC<HoliCarouselProps> = ({
  slides,
  style,
  hideDotIndicators,
  slideWidth,
  marginHorizontal = 0, // margin between slide and device screen
}: HoliCarouselProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)
  const carousel = React.useRef<ScrollView | null>(null)

  const { width: screenWidth } = useClientWindowDimensions()

  const marginBetweenSlides = 8 // margin between slides
  const scrollingOffset = slideWidth
    ? slideWidth + marginBetweenSlides
    : screenWidth - (marginHorizontal * 2 - marginBetweenSlides)
  const defaultSlideWidth = slideWidth || 350
  const horizontalScrollMinWidth = 600

  const { theme } = useTheme()
  const styles = getStyles(
    screenWidth,
    marginHorizontal,
    marginBetweenSlides,
    defaultSlideWidth,
    horizontalScrollMinWidth,
    theme,
    slideWidth
  )

  const handleOnScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    const contentOffset = nativeEvent?.contentOffset
    if (!contentOffset) return

    // Math round increases the current slider index by one when scrolling more
    // than halfway through the slide.
    const currentIndexPosition = Math.round(contentOffset.x / scrollingOffset)
    setCurrentSlideIndex(currentIndexPosition)
  }

  const goToSlide = (slide: number) => {
    if (!carousel || !carousel.current) {
      return
    }

    const scrollPoint = slide * scrollingOffset
    carousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })
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
          // The event loop syncs to the screen refresh rate; for iOS, the rate
          // is at least 60 times per second. We want to throttle onScroll to
          // avoid missing frames and call 15 fps (1000 / 15 = 66.6) on iOS.
          scrollEventThrottle={66}
          onScroll={handleOnScroll}
        >
          {
            /** FIXME: convert to VirtualizedList, FlatList or SectionList */
            slides.map((slide, i) => (
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
            ))
          }
        </ScrollView>
      )}

      {!hideDotIndicators && !isWeb && slides.length > 1 && (
        <View style={styles.slideButtonsContainer} role="tablist" accessibilityOrientation="horizontal">
          {slides.map((slide, slideIndex) => (
            <HoliTabButton
              label={slide.title || '' + (slideIndex + 1)}
              style={styles.slideButton}
              onPress={() => goToSlide(slideIndex)}
              key={slideIndex}
              aria-selected={slideIndex === currentSlideIndex}
              testID={slideIndex === slideIndex ? 'active-tab' : 'inactive-tab'}
            >
              <View
                style={[styles.slideButtonIcon, slideIndex === currentSlideIndex && styles.activeSlideButtonIcon]}
              />
            </HoliTabButton>
          ))}
        </View>
      )}

      {/*
        Web scrollview uses simple scrolling.
        When screenWidth < horizontalScrollMinWidth, it uses snap and hides the horizontal scrollbar.
        The slide buttons underneath are not displayed on Web for now.
      */}
      {isWeb && (
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          horizontal
          showsHorizontalScrollIndicator={screenWidth >= horizontalScrollMinWidth}
        >
          {
            /** FIXME convert to VirtualizedList, FlatList or SectionList */
            slides.map((slide, i) => (
              <View style={[styles.slideContainer, i === 0 ? styles.firstSlideContainer : {}]} key={i}>
                {slide.children}
              </View>
            ))
          }
          <View style={styles.lastSlideSpacing} />
        </ScrollView>
      )}
    </View>
  )
}

export default HoliCarousel

const getStyles = (
  screenWidth: number,
  marginHorizontal: number,
  marginBetweenSlides: number,
  defaultSlideWidth: number,
  horizontalScrollMinWidth: number,
  theme: HoliTheme,
  slideWidth?: number
) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    scrollViewContainerStyle: {
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollViewStyle: {
      width: '100%',
      flexDirection: 'row',
      ...Platform.select({
        web: {
          scrollSnapType: screenWidth < horizontalScrollMinWidth ? 'x mandatory' : 'none',
        },
      }),
    },
    slideContainer: {
      flexDirection: 'row',
      height: '100%',
      width: slideWidth ? slideWidth : screenWidth - marginHorizontal * 2,
      marginLeft: marginBetweenSlides,
      marginRight: 0,
      ...Platform.select({
        web: {
          scrollSnapAlign: 'center',
          width: slideWidth
            ? slideWidth
            : screenWidth < horizontalScrollMinWidth
              ? screenWidth - marginHorizontal * 2
              : defaultSlideWidth,
          paddingRight: 0,
        },
      }),
    },
    firstSlideContainer: {
      marginLeft: marginHorizontal,
    },
    lastSlideContainer: {
      marginRight: marginHorizontal,
    },
    lastSlideSpacing: {
      width: marginHorizontal,
    },
    slideButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: Spacing.md,
    },
    slideButton: {
      marginHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideButtonIcon: {
      width: 8,
      height: 8,
      backgroundColor: theme.colors.foreground30,
      opacity: 0.3,
      borderRadius: 50,
    },
    activeSlideButtonIcon: {
      backgroundColor: theme.colors.foreground30,
      opacity: 1,
    },
  })
