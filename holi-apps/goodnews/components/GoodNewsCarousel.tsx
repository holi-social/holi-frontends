import React, { useRef, useState } from 'react'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'

export type GoodNewsCarouselProps = {
  articles: GoodNewsArticle[]
  width: number
}

const renderItem = ({ item }: { item: GoodNewsArticle; index: number }) => (
  <GoodNewsArticleComponent article={item} key={item.id} />
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GoodNewsCarousel: React.VFC<GoodNewsCarouselProps> = (props: GoodNewsCarouselProps) => {
  const carouselRef = useRef<Carousel<GoodNewsArticle> | null>(null)
  const [activeSlide, setActiveSlide] = useState<number>(0)
  const carousel = (
    <Carousel
      ref={(c) => (carouselRef.current = c)}
      data={props.articles}
      renderItem={renderItem}
      onSnapToItem={(index) => setActiveSlide(index)}
      sliderWidth={props.width}
      itemWidth={props.width}
    />
  )
  const pagination = (
    <Pagination
      tappableDots={true}
      carouselRef={carouselRef}
      dotsLength={props.articles.length}
      activeDotIndex={activeSlide}
      dotStyle={{
        width: 6,
        height: 6,
        borderRadius: 16,
        marginHorizontal: 0,
      }}
      inactiveDotStyle={
        {
          // Define styles for inactive dots here
        }
      }
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
    />
  )

  return (
    <>
      {carousel}
      {pagination}
    </>
  )
}

export default GoodNewsCarousel
