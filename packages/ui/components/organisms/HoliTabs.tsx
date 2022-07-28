import * as React from 'react'
import { NativeScrollEvent, Platform, ScrollView, Text, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliTabsProps = {
  tabs: { title: string; children: React.ReactNode }[]
  relativeHeight?: number
}

const HoliTabs: React.FunctionComponent<HoliTabsProps> = ({ tabs, relativeHeight = 0.6 }: HoliTabsProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef<ScrollView | null>(null)

  const { width: screenWidth, height: screenHeight } = useWindowDimensions()

  const { theme } = useTheme()
  const styles = getStyles(theme, screenHeight, relativeHeight)
  const isWeb = Platform.OS === 'web'

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
    <View style={styles.container as ViewStyle}>
      <View
        style={styles.tabButtonsContainer as ViewStyle}
        accessibilityRole="tablist"
        accessibilityOrientation="horizontal"
      >
        {tabs.map((tab, index) => (
          <HoliButton
            label={tab.title}
            transparent
            inline
            style={[styles.tabButton, currentSlide === index ? styles.activeTabButton : {}]}
            onPress={() => goToIndex(index)}
            key={index}
            accessibilityRole="tab"
            accessibilitySelected={currentSlide === index}
            accessibilityLabel={'' + index}
            testID={currentSlide === index ? 'active-tab' : 'inactive-tab'}
          >
            <Text
              style={[styles.tabButtonText, currentSlide === index ? (styles.activeTabButtonText as ViewStyle) : {}]}
            >
              {tab.title}
            </Text>
          </HoliButton>
        ))}
      </View>
      {!isWeb && (
        <ScrollView
          ref={carousel}
          contentContainerStyle={styles.scrollViewContainerStyle as ViewStyle}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment={'center'}
          decelerationRate={0}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={styles.tabContainer as ViewStyle}>
            {tabs.map((tab, i) => (
              <View
                style={{
                  width: screenWidth,
                }}
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
          style={[styles.tabContainer as ViewStyle, { width: '100%' }]}
          accessibilityRole="tabpanel"
          focusable={true}
        >
          <View
            style={{
              width: '100%',
            }}
          >
            {tabs[currentSlide].children}
          </View>
        </View>
      )}
    </View>
  )
}

export default HoliTabs

const getStyles = (theme: HoliTheme, screenHeight: number, relativeHeight: number) => ({
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
  tabButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: theme.colors.borderColorGrey,
    borderBottomWidth: 2,
  },
  tabButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    borderBottomWidth: 2,
    top: 2, // must be the same value as the tabButtonsContainer borderWidth
    borderBottomColor: 'transparent',
  },
  tabButtonText: {
    fontSize: 16,
    color: theme.colors.fontColorGrey,
  },
  activeTabButton: {
    borderBottomColor: theme.colors.fontColor,
  },
  activeTabButtonText: {
    color: theme.colors.fontColor,
    fontWeight: '500',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: screenHeight * relativeHeight,
    width: '100%',
  },
})
