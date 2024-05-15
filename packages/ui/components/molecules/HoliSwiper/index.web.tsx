import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import PaginationDot from 'react-native-animated-pagination-dot'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Virtual } from 'swiper/modules'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'

import { isWebTouchDevice } from '@holi/ui/helper'
import { useTheme } from '@holi/ui/styles/theme'

import './styles.scss'
import { HoliSwiperProps } from './types'

const isTouchDevice = isWebTouchDevice()

const HoliSwiper = ({
  children,
  initialSlide,
  onSlideChange,
  height = '100%',
  width = '100%',
  count,
}: PropsWithChildren<HoliSwiperProps>) => (
  <Swiper
    initialSlide={initialSlide}
    navigation={!isTouchDevice}
    modules={isTouchDevice ? [Virtual] : [Virtual, Navigation]}
    allowTouchMove={isTouchDevice}
    virtual
    onSlideChange={onSlideChange ? (swiper) => onSlideChange?.(swiper.activeIndex) : undefined}
    className="holi-swiper"
    style={{ height, width, paddingBottom: PAGINATION_HEIGHT }}
    key={initialSlide} // use key to rerender Swiper if `initialArticleIndex` changes
  >
    {children}

    <HoliSwiperPagination maxPage={count} />
  </Swiper>
)

HoliSwiper.Slide = SwiperSlide

interface HoliSwiperPaginationProps {
  maxPage: number
}

const HoliSwiperPagination = ({ maxPage }: HoliSwiperPaginationProps) => {
  const swiper = useSwiper()

  const { theme } = useTheme()
  const { colors } = theme

  return (
    <div style={styles.pagination} slot="container-end">
      <PaginationDot
        activeDotColor={colors.foreground30}
        inactiveDotColor={colors.foreground20}
        curPage={swiper?.activeIndex}
        maxPage={maxPage}
        sizeRatio={1.0}
      />
    </div>
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
