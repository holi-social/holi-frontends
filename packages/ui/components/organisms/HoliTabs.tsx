import * as React from 'react'
import {
  NativeScrollEvent,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type HoliTabsProps = {
  id: string
  tabs: { title: string; children: React.ReactNode; titleIcon?: string; style?: StyleProp<ViewStyle> }[]
  centeredButtons?: boolean
  onChangeTab?: (index: number) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const isWeb = Platform.OS === 'web'

const HoliTabs: React.FunctionComponent<HoliTabsProps> = ({
  id,
  tabs,
  centeredButtons,
  onChangeTab = () => null,
  style,
  testID = 'tabs-module',
}: HoliTabsProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef<ScrollView | null>(null)

  const { width: screenWidth } = useWindowDimensions()

  const mixins = useStyleMixins()
  const styles = getStyles(screenWidth, centeredButtons)

  const handleScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (!nativeEvent || !nativeEvent.contentOffset) {
      return
    }

    // Using Math.round means that when scrolling more than half of the slide width, it will move slides
    setCurrentSlide(Math.round(nativeEvent.contentOffset.x / screenWidth))
  }

  const goToIndex = (index: number) => {
    onChangeTab(index)
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
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.headerContainer} accessibilityRole="tablist" accessibilityOrientation="horizontal">
        <View style={[mixins.container, styles.tabButtonsContainer]}>
          {
            /** FIXME convert to VirtualizedList, FlatList or SectionList */
            tabs.map((tab, index) => {
              const isActive = currentSlide === index
              return (
                <HoliTabButton
                  label={tab.title}
                  id={`${id}-tab-${index}`}
                  style={[styles.tabButton, isActive ? styles.activeTabButton : {}]}
                  onPress={() => goToIndex(index)}
                  key={index}
                  accessibilitySelected={isActive}
                  accessibilityControls={`${id}-panel-${index}`}
                  testID={`${testID}-button-${index}-${isActive ? 'active' : 'inactive'}`}
                >
                  {tab.titleIcon && (
                    <HoliIcon
                      icon={tab.titleIcon}
                      size={22}
                      color={isActive ? colors.fontColor : colors.fontColorGrey}
                      style={styles.tabButtonIcon}
                      filled={isActive}
                    />
                  )}
                  <Text style={[styles.tabButtonText, isActive ? styles.activeTabButtonText : {}]}>{tab.title}</Text>
                </HoliTabButton>
              )
            })
          }
        </View>
      </View>
      {!isWeb && (
        <ScrollView
          ref={carousel}
          contentContainerStyle={styles.scrollViewContainerStyle}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={styles.tabContainer}>
            {
              /** FIXME convert to VirtualizedList, FlatList or SectionList */
              tabs.map((tab, i) => (
                <View
                  style={[styles.tab, tab.style]}
                  accessibilityLabelledBy={`${id}-tab-${i}`}
                  nativeID={`${id}-panel-${i}`}
                  testID={`${testID}-panel-${i}-${currentSlide === i ? 'active' : 'inactive'}`}
                  key={i}
                >
                  {tab.children}
                </View>
              ))
            }
          </View>
        </ScrollView>
      )}

      {isWeb && (
        <View
          style={[styles.tabContainer, tabs[currentSlide].style]}
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

const getStyles = (screenWidth: number, centeredButtons = false) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    scrollViewContainerStyle: {
      alignContent: 'flex-start',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    headerContainer: {
      width: '100%',
      borderBottomColor: colors.borderColorGrey,
      borderBottomWidth: 2,
    },
    tabButtonsContainer: {
      flexDirection: 'row',
      justifyContent: centeredButtons ? 'center' : 'flex-start',
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
    tabButtonIcon: {
      marginRight: 8,
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
    tab: {
      width: screenWidth,
    },
  })
