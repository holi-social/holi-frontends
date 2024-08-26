import { withProfiler } from '@sentry/react'
import React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { FeedPostImage } from '@holi/core/screens/individualPosts/types'

import ImagePreview from './ImagePreview'

type ImageCarouselProps = {
  style?: ViewStyle
  images: FeedPostImage[]
}

const ImageCarousel = ({ style, images }: ImageCarouselProps) => {
  return (
    <View style={[styles.container, style]}>
      <Carousel
        responsive={{
          desktop: {
            breakpoint: { max: 300000, min: 0 },
            items: 1,
          },
        }}
      >
        {images.map((item, index) => (
          <ImagePreview
            key={index}
            currentImage={item.image}
            blurhash={item.imageBlurhash}
            style={{ pointerEvents: 'none' }} // to enable drag and drop slides
          />
        ))}
      </Carousel>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default withProfiler(ImageCarousel, { name: 'PostCard' })
