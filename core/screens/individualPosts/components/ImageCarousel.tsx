import { withProfiler } from '@sentry/react'
import React, { useState } from 'react'
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { FeedPostImage } from '@holi/core/screens/individualPosts/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useTheme } from '@holi/ui/styles/theme'

type ImageCarouselProps = {
  style?: ViewStyle
  images: FeedPostImage[]
  onPressItem?: () => void
}

const ImageCarousel = ({ style, images, onPressItem }: ImageCarouselProps) => {
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
          snapEnabled={true}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          scrollAnimationDuration={200} // default is 500
          renderItem={({ index, item }: { index: number; item: FeedPostImage }) => (
            <View style={styles.item}>
              {onPressItem ? (
                <HoliButton transparent inline label={item.altText || ''} onPress={onPressItem}>
                  <ImagePreview
                    key={index}
                    currentImage={item.image}
                    blurhash={item.imageBlurhash}
                    style={styles.image}
                  />
                </HoliButton>
              ) : (
                <ImagePreview
                  key={index}
                  currentImage={item.image}
                  blurhash={item.imageBlurhash}
                  style={styles.image}
                />
              )}
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
  image: {
    paddingHorizontal: 4,
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
