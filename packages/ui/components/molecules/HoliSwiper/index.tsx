import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import PaginationDot from 'react-native-animated-pagination-dot'
import Swiper from 'react-native-swiper'

import { useTheme } from '@holi/ui/styles/theme'

import { HoliSwiperProps, HoliSwiperSlideProps } from './types'

interface HoliSwiperContextValue {
  activeIndex: number
}

const HoliSwiperContext = createContext<HoliSwiperContextValue>({
  activeIndex: 0,
})

const useSwiper = () => useContext(HoliSwiperContext)

const HoliSwiper = ({ children, initialSlide, onSlideChange, count }: PropsWithChildren<HoliSwiperProps>) => {
  const [activeIndex, setActiveIndex] = useState(initialSlide ?? 0)

  return (
    <HoliSwiperContext.Provider value={{ activeIndex }}>
      <Swiper
        index={initialSlide}
        onIndexChanged={(index) => {
          setActiveIndex(index)
          onSlideChange?.(index)
        }}
        loop={false}
        showsButtons={false}
        showsPagination={false} // disable to only show `HoliSwiperPagination`
      >
        {children}
      </Swiper>

      <HoliSwiperPagination maxPage={count} />
    </HoliSwiperContext.Provider>
  )
}

HoliSwiper.Slide = React.memo(({ children, virtualIndex }: HoliSwiperSlideProps) => {
  const { activeIndex } = useSwiper()

  return (
    <View style={styles.slide}>
      {typeof children === 'function'
        ? children({
            isActive: virtualIndex === activeIndex,
            isPrev: activeIndex - virtualIndex === 1,
            isNext: activeIndex - virtualIndex === -1,
          })
        : children}
    </View>
  )
})
HoliSwiper.Slide.displayName = 'HoliSwiperSlide'

interface HoliSwiperPaginationProps {
  maxPage: number
}

const HoliSwiperPagination = ({ maxPage }: HoliSwiperPaginationProps) => {
  const { activeIndex } = useSwiper()

  const { theme } = useTheme()
  const { colors } = theme

  return (
    <View style={styles.pagination} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden={true}>
      <PaginationDot
        activeDotColor={colors.foreground30}
        inactiveDotColor={colors.foreground20}
        curPage={activeIndex}
        maxPage={maxPage}
        sizeRatio={1.0}
      />
    </View>
  )
}

export default HoliSwiper

const PAGINATION_HEIGHT = 50

const styles = StyleSheet.create({
  slide: {
    paddingBottom: PAGINATION_HEIGHT,
    height: '100%',
  },
  pagination: {
    backgroundColor: 'transparent',
    bottom: 12,
    minHeight: PAGINATION_HEIGHT,
    position: 'absolute',
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    zIndex: -1,
  },
})
