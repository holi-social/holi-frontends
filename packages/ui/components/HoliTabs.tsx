import * as React from 'react'
import {
  Image,
  NativeScrollEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextLayoutLine,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Dimensions } from 'react-native'

import HoliText, { HoliTextProps } from '@holi/ui/components/HoliText'
import theme from '@holi/ui/styles/theme'

const { width: screenWidth } = Dimensions.get('window')

export const cardPerSlide = 2
export const cardPadding = 15
export const paddingAround = cardPadding * 2 // slide horizontal padding
export const cardBetweenPadding = cardPadding * (cardPerSlide - 1)
export const totalPadding = paddingAround + cardBetweenPadding
export const imageWidth = (screenWidth - totalPadding) / cardPerSlide
export const imageHeight = imageWidth / (2 / 3)

const movies = [
  { url: 'https://image.tmdb.org/t/p/w1280/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/z7FCF54Jvzv9Anxyf82QeqFXXOO.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/3Nt3v1uzUgfSuVARD1AnI9g9Zl9.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/pThyQovXQrw2m0s9x82twj48Jq4.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/tgcrYiyG75iDcyk3en9NzZis0dh.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/y95lQLnuNKdPAzw9F9Ab8kJ80c3.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/h6Wi81XNXCjTAcdstiCLRykN3Pa.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/d9PhCnofBEeQGR3lwywTjWKBiXj.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/qR2sOAnLcdysU1be1PO6Y0pfuR5.jpg' },
  { url: 'https://image.tmdb.org/t/p/w1280/yTIsWzMUsrKdNngIEf15Iz1n3SS.jpg' },
]

export type CarouselSlideProps = {
  cards: { url: string }[]
}

const CarouselSlide: React.FunctionComponent<CarouselSlideProps> = ({ cards }) => {
  const styles = StyleSheet.create({
    slide: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: screenWidth,
      paddingHorizontal: cardPadding,
    },
    imageCard: {
      width: imageWidth,
      height: imageHeight,
    },
  })
  return (
    <View style={styles.slide}>
      {cards.map((card, index) => {
        return <Image source={{ uri: card.url }} style={styles.imageCard} key={index} />
      })}
    </View>
  )
}

/**
 *
 * This component returns a View which encapsulates HoliText components.
 * Most accessibility props are already present in the HoliText component itself.
 */
const HoliTabs: React.FunctionComponent = (_props) => {
  const [totalSlide, setTotalSlide] = React.useState(0)
  const [currentSlide, setCurrentSlide] = React.useState(1)
  const [isNext, setIsNext] = React.useState(false)
  const [isPrev, setIsPrev] = React.useState(false)

  const stepCarousel = React.useRef<ScrollView | null>(null)

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
  const noOfSlides = Math.ceil(movies.length / cardPerSlide)

  const styles = getStyles()

  // function will find out total no of slide and set to state
  const setTotalSlides = (contentWidth: number) => {
    // contentWidth received from onContentSizeChange
    if (contentWidth !== 0) {
      const approxSlide = contentWidth / screenWidth
      if (totalSlide !== approxSlide) {
        setTotalSlide(Math.ceil(+approxSlide.toFixed(2)))
        calculateNextPrev(approxSlide, currentSlide)
      }
    }
  }

  // function will identify current slide visible on screen
  // Also maintaining current slide on carousel swipe.
  const handleScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (!nativeEvent) {
      return
    }
    // const { nativeEvent } = e
    if (nativeEvent && nativeEvent.contentOffset) {
      let currentSlide = 1
      if (nativeEvent.contentOffset.x === 0) {
        setCurrentSlide(currentSlide)
      } else {
        const approxCurrentSlide = nativeEvent.contentOffset.x / screenWidth

        setCurrentSlide(Math.ceil(+approxCurrentSlide.toFixed(2)) + 1)
      }
      calculateNextPrev(totalSlide, currentSlide)
    }
  }

  const goToNext = () => {
    if (stepCarousel && stepCarousel.current) {
      const scrollPoint = currentSlide * screenWidth
      stepCarousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })
      // following condition is for android only because in android onMomentumScrollEnd doesn't
      // call when we scrollContent with scroll view reference.
      if (Platform.OS === 'android') {
        handleScrollEnd({ nativeEvent: { contentOffset: { y: 0, x: scrollPoint } } } as {
          nativeEvent: NativeScrollEvent
        })
      }
    }
  }

  const goToPrev = () => {
    if (stepCarousel && stepCarousel.current) {
      const pageToGo = currentSlide - 2
      const scrollPoint = pageToGo * screenWidth
      stepCarousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })
      // following condition is for android only because in android onMomentumScrollEnd doesn't
      // call when we scrollContent with scrollview reference.
      if (Platform.OS === 'android') {
        handleScrollEnd({ nativeEvent: { contentOffset: { y: 0, x: scrollPoint } } } as {
          nativeEvent: NativeScrollEvent
        })
      }
    }
  }

  const calculateNextPrev = (totalPage: number, currentPage: number) => {
    if (totalPage > currentPage) {
      setIsNext(true)
    }
    if (currentPage === 1) {
      setIsPrev(false)
    }
    if (currentPage === totalPage) {
      setIsNext(false)
    }
    if (currentPage > 1) {
      setIsPrev(true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navBarTitle}>MOVIES</Text>
      </View>
      <ScrollView
        ref={stepCarousel}
        contentContainerStyle={styles.scrollViewContainerStyle}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        snapToAlignment={'center'}
        onContentSizeChange={setTotalSlides}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {[...Array(noOfSlides)].map((_, i) => {
          const startIndex = i + 1
          const startPosition = startIndex + (startIndex - 1) - 1
          const endPosition = startIndex * 2
          return <CarouselSlide key={i} cards={movies.slice(startPosition, endPosition)} />
        })}
      </ScrollView>
      <View style={styles.cardCountContainer}>
        <Text style={styles.countText}>Total Slides : {totalSlide}</Text>
        <Text style={styles.countText}>Current Slide : {currentSlide}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, !isPrev && styles.disable]} onPress={goToPrev} disabled={!isPrev}>
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, !isNext && styles.disable]} onPress={goToNext} disabled={!isNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HoliTabs

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    navBar: {
      width: '100%',
      height: 70,
      backgroundColor: '#0D0D0D',
      alignContent: 'center',
      justifyContent: 'center',
    },
    navBarTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    scrollViewContainerStyle: {
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: imageHeight + 50,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
    },
    button: {
      height: 50,
      width: 100,
      backgroundColor: '#0D0D0D',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
    },
    disable: {
      opacity: 0.5,
    },
    cardCountContainer: {
      paddingBottom: 20,
    },
    countText: {
      fontSize: 26,
    },
  })
