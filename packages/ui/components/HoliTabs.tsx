import * as React from 'react'
import { NativeScrollEvent, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Dimensions } from 'react-native'

export type HoliTabsProps = {
  tabs: { title: string; children: React.ReactNode }[]
}

const HoliTabs: React.FunctionComponent<HoliTabsProps> = ({ tabs }: HoliTabsProps) => {
  const [totalSlides, setTotalSlides] = React.useState(tabs.length)
  const [currentSlide, setCurrentSlide] = React.useState(0)

  const stepCarousel = React.useRef<ScrollView | null>(null)

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  const styles = getStyles()

  const recalculateTotalSlides = (contentWidth: number) => {
    console.log(contentWidth, screenWidth)
    if (contentWidth !== 0) {
      const approxSlide = contentWidth / screenWidth
      if (totalSlides !== approxSlide) {
        setTotalSlides(Math.ceil(+approxSlide.toFixed(2)))
      }
    }
  }

  const handleScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (!nativeEvent || !nativeEvent.contentOffset) {
      return
    }

    if (nativeEvent.contentOffset.x === 0) {
      setCurrentSlide(0)
    } else {
      const approxCurrentSlide = nativeEvent.contentOffset.x / screenWidth
      setCurrentSlide(Math.ceil(+approxCurrentSlide.toFixed(2)))
    }
  }

  const goToNext = () => {
    if (stepCarousel && stepCarousel.current) {
      const scrollPoint = (currentSlide + 1) * screenWidth
      stepCarousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })

      if (Platform.OS === 'android') {
        handleScrollEnd({ nativeEvent: { contentOffset: { y: 0, x: scrollPoint } } } as {
          nativeEvent: NativeScrollEvent
        })
      }
    }
  }

  const goToPrevious = () => {
    if (stepCarousel && stepCarousel.current) {
      const pageToGo = currentSlide - 1
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

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navBarTitle}>{tabs[currentSlide].title}</Text>
      </View>
      <ScrollView
        ref={stepCarousel}
        contentContainerStyle={styles.scrollViewContainerStyle}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate={'fast'}
        snapToAlignment={'center'}
        onContentSizeChange={recalculateTotalSlides}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: screenHeight * 0.6,
          }}
        >
          {[...Array(totalSlides)].map((_, i) => (
            <View
              style={{
                width: screenWidth,
              }}
              key={i}
            >
              {tabs[i].children}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.cardCountContainer}>
        <Text style={styles.countText}>Total Slides : {totalSlides}</Text>
        <Text style={styles.countText}>Current Slide : {currentSlide}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !currentSlide && styles.disable]}
          onPress={goToPrevious}
          disabled={!currentSlide}
        >
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, currentSlide === totalSlides - 1 && styles.disable]}
          onPress={goToNext}
          disabled={currentSlide === totalSlides - 1}
        >
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
