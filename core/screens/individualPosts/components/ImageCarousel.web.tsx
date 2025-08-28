import { withProfiler } from '@sentry/react'
import React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { View, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { FeedPostImage, ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type ImageCarouselProps = {
  style?: ViewStyle
  images: FeedPostImage[]
  onPressItem?: () => void
}

const ImageCarousel = ({ style, images, onPressItem }: ImageCarouselProps) => {
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
        {images.map((item, index) =>
          onPressItem ? (
            <HoliButton
              key={index}
              transparent
              inline
              label={item.altText || ''}
              onPress={onPressItem}
              style={styles.button}
            >
              <ImagePreview
                currentImage={item.image}
                blurhash={item.imageBlurhash}
                style={styles.image}
                aspectRatio={item.aspectRatio === ImageAspectRatio.ONE_ONE ? 1 : 16 / 9}
              />
            </HoliButton>
          ) : (
            <ImagePreview
              key={index}
              currentImage={item.image}
              blurhash={item.imageBlurhash}
              style={styles.image}
              aspectRatio={item.aspectRatio === ImageAspectRatio.ONE_ONE ? 1 : 16 / 9}
            />
          )
        )}
      </Carousel>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: { width: '100%' },
  image: { pointerEvents: 'none' }, // to enable drag and drop slides
})

export default withProfiler(ImageCarousel, { name: 'PostCard' })
