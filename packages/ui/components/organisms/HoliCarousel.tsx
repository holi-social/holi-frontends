import * as React from 'react'
import { NativeScrollEvent, Platform, ScrollView, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliCarouselProps = {
  slides: { title?: string; children: React.ReactNode }[]
}

const HoliCarousel: React.FunctionComponent<HoliCarouselProps> = ({ slides }: HoliCarouselProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef<ScrollView | null>(null)

  const { width: screenWidth } = useWindowDimensions()

  const { theme } = useTheme()
  const styles = getStyles(theme)
  const isWeb = Platform.OS === 'web'

  const marginHorizontal = 24 // margin between slide and device screen
  const marginBetweenSlides = 8 // margin between slides

  const scrollingOffset = screenWidth - (marginHorizontal * 2 - marginBetweenSlides)

  const handleScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (!nativeEvent || !nativeEvent.contentOffset) {
      return
    }
    // Using Math.round means that when scrolling more than half of the slide width, it will move slides
    setCurrentSlide(Math.round(nativeEvent.contentOffset.x / scrollingOffset))
  }

  const goToIndex = (index: number) => {
    if (isWeb) {
      setCurrentSlide(index)
      return
    }
    if (!carousel || !carousel.current) {
      return
    }

    const scrollPoint = index * scrollingOffset
    carousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })
    setCurrentSlide(index)
  }

  return (
    <View style={styles.container as ViewStyle}>
      <ScrollView
        ref={carousel}
        contentContainerStyle={styles.scrollViewContainerStyle as ViewStyle}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={scrollingOffset}
        decelerationRate={0}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <View style={styles.slideContainer as ViewStyle}>
          {slides.map((tab, i) => (
            <View
              style={{
                width: screenWidth - marginHorizontal * 2,
                marginLeft: i === 0 ? marginHorizontal : marginBetweenSlides,
                marginRight: i === slides.length - 1 ? marginHorizontal : 0,
              }}
              key={i}
            >
              {tab.children}
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={styles.slideButtonsContainer as ViewStyle}
        accessibilityRole="tablist"
        accessibilityOrientation="horizontal"
      >
        {slides.map((tab, index) => (
          <HoliButton
            label={tab.title || ''}
            transparent
            inline
            style={[styles.slideButton, currentSlide === index ? styles.activeslideButton : {}]}
            onPress={() => goToIndex(index)}
            key={index}
            accessibilityRole="tab"
            accessibilitySelected={currentSlide === index}
            accessibilityLabel={'' + index}
            testID={currentSlide === index ? 'active-tab' : 'inactive-tab'}
          >
            <View
              style={[
                styles.slideButtonIcon,
                currentSlide === index ? (styles.activeslideButtonIcon as ViewStyle) : {},
              ]}
            ></View>
            {/* <Text
              style={[
                styles.slideButtonText,
                currentSlide === index ? (styles.activeslideButtonIcon as ViewStyle) : {},
              ]}
            >
              .
            </Text> */}
          </HoliButton>
        ))}
      </View>
    </View>
  )
}

export default HoliCarousel

const getStyles = (theme: HoliTheme) => ({
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
    backgroundColor: theme.colors.fontColorGrey,
    borderRadius: 50,
  },
  slideButtonText: {
    fontSize: 70,
    lineHeight: 22 * 1.2,
    color: theme.colors.fontColorGrey,
  },
  activeslideButton: {
    borderBottomColor: theme.colors.fontColor,
  },
  activeslideButtonIcon: {
    backgroundColor: theme.colors.fontColor,
  },
  slideContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
})
