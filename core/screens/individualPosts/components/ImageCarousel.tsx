import { withProfiler } from '@sentry/react'
import React, { useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { FeedPostImage } from '@holi/core/screens/individualPosts/types'
import { useTheme } from '@holi/ui/styles/theme'

type ImageCarouselProps = {
  style?: ViewStyle
  images: FeedPostImage[]
}

const ImageCarousel = ({ style, images }: ImageCarouselProps) => {
  const { theme } = useTheme()
  const [viewWidth, setViewWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setViewWidth(width)
  }

  return (
    <View onLayout={onLayout} style={style}>
      {viewWidth > 0 && (
        <Carousel
          vertical={false}
          width={viewWidth}
          height={(viewWidth * 9) / 16}
          loop={false}
          data={images}
          onSnapToItem={(index: number) => setCurrentIndex(index)}
          renderItem={({ index, item }: { index: number; item: FeedPostImage }) => (
            <View style={styles.item}>
              <ImagePreview
                key={index}
                currentImage={item.image}
                blurhash={item.imageBlurhash}
                style={{ padding: 4 }}
              />
            </View>
          )}
        />
      )}
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex
                  ? { backgroundColor: theme.colors.foreground30 }
                  : { backgroundColor: theme.colors.foreground10 },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
})

export default withProfiler(ImageCarousel, { name: 'PostCard' })
