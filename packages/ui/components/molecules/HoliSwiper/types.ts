export interface HoliSwiperProps {
  initialSlide?: number
  onSlideChange?: (slide: number) => void
  height?: number | string
  width?: number | string
  count: number
}

export interface HoliSwiperSlideData {
  isActive: boolean
  isPrev: boolean
  isNext: boolean
}

export interface HoliSwiperSlideProps {
  virtualIndex: number
  children?: React.ReactNode | ((slideData: HoliSwiperSlideData) => React.ReactNode)
}
