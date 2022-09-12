import * as React from 'react'
import {
  NativeScrollEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type HoliTabsProps = {
  id: string
  tabs: { title: string; children: React.ReactNode }[]
  relativeHeight?: number
  testID?: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const isWeb = Platform.OS === 'web'

const HoliTabs: React.FunctionComponent<HoliTabsProps> = ({
  id,
  tabs,
  style,
  testID = 'tabs-module',
}: HoliTabsProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef<ScrollView | null>(null)

  const { width: screenWidth } = useWindowDimensions()

  const mixins = useStyleMixins()
  const styles = getStyles()

  const handleScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (!nativeEvent || !nativeEvent.contentOffset) {
      return
    }
    // Using Math.round means that when scrolling more than half of the slide width, it will move slides
    setCurrentSlide(Math.round(nativeEvent.contentOffset.x / screenWidth))
  }

  const goToIndex = (index: number) => {
    if (isWeb) {
      setCurrentSlide(index)
      return
    }
    if (!carousel || !carousel.current) {
      return
    }

    const scrollPoint = index * screenWidth
    carousel.current.scrollTo({ x: scrollPoint, y: 0, animated: true })
    setCurrentSlide(index)
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerContainer} accessibilityRole="tablist" accessibilityOrientation="horizontal">
        <View style={[mixins.container, styles.tabButtonsContainer]}>
          {tabs.map((tab, index) => {
            const isActive = currentSlide === index
            return (
              <HoliButton
                label={tab.title}
                id={`${id}-tab-${index}`}
                transparent
                inline
                style={[styles.tabButton, isActive ? styles.activeTabButton : {}]}
                onPress={() => goToIndex(index)}
                key={index}
                accessibilityRole="tab"
                accessibilitySelected={isActive}
                accessibilityControls={`${id}-panel-${index}`}
                testID={`${testID}-button-${index}-${isActive ? 'active' : 'inactive'}`}
              >
                <Text style={[styles.tabButtonText, isActive ? styles.activeTabButtonText : {}]}>{tab.title}</Text>
              </HoliButton>
            )
          })}
        </View>
      </View>
      {!isWeb && (
        <ScrollView
          ref={carousel}
          contentContainerStyle={styles.scrollViewContainerStyle}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment={'center'}
          decelerationRate={0}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={styles.tabContainer}>
            {tabs.map((tab, i) => (
              <View
                style={{
                  width: screenWidth,
                }}
                accessibilityLabelledBy={`${id}-tab-${i}`}
                nativeID={`${id}-panel-${i}`}
                testID={`${testID}-panel-${i}-${currentSlide === i ? 'active' : 'inactive'}`}
                key={i}
              >
                {tab.children}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {isWeb && (
        <View
          style={styles.tabContainer}
          accessibilityRole="tabpanel"
          accessibilityLabelledBy={`${id}-tab-${currentSlide}`}
          nativeID={`${id}-panel-${currentSlide}`}
          testID={`${testID}-panel-${currentSlide}-active`}
        >
          {tabs[currentSlide].children}
        </View>
      )}
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
    },
    scrollViewContainerStyle: {
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      width: '100%',
      borderBottomColor: colors.borderColorGrey,
      borderBottomWidth: 2,
    },
    tabButtonsContainer: {
      flexDirection: 'row',
    },
    tabButton: {
      paddingVertical: 12,
      marginRight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      borderBottomWidth: 2,
      top: 2, // must be the same value as the tabButtonsContainer borderWidth
      borderBottomColor: 'transparent',
    },
    tabButtonText: {
      fontSize: 16,
      color: colors.fontColorGrey,
    },
    activeTabButton: {
      borderBottomColor: colors.fontColor,
    },
    activeTabButtonText: {
      color: colors.fontColor,
      fontWeight: '500',
    },
    tabContainer: {
      flex: 1,
      width: '100%',
      ...Platform.select({
        native: {
          flexDirection: 'row',
        },
      }),
    },
  })
