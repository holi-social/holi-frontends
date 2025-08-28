import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { type LayoutChangeEvent, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import Carousel from 'react-native-reanimated-carousel'

import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { type FeedPostImage, ImageAspectRatio } from '@holi/core/screens/individualPosts/types'
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

  // all images should have the same aspect ratio
  const aspectRatio = useMemo(() => {
    return images[0].aspectRatio || ImageAspectRatio.SIXTEEN_NINE
  }, [images])

  return (
    <View onLayout={onLayout} style={style}>
      {viewWidth > 0 && (
        <Carousel
          vertical={false}
          width={viewWidth}
          height={viewWidth / (aspectRatio === ImageAspectRatio.SIXTEEN_NINE ? 16 / 9 : 1)}
          loop={false}
          data={images}
          onSnapToItem={(index: number) => setCurrentIndex(index)}
          snapEnabled={true}
          onConfigurePanGesture={(gesture) => {
            'worklet'
            gesture.activeOffsetX([-10, 10])
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
                    aspectRatio={aspectRatio === ImageAspectRatio.SIXTEEN_NINE ? 16 / 9 : 1}
                  />
                </HoliButton>
              ) : (
                <ImagePreview
                  key={index}
                  currentImage={item.image}
                  blurhash={item.imageBlurhash}
                  style={styles.image}
                  aspectRatio={aspectRatio === ImageAspectRatio.SIXTEEN_NINE ? 16 / 9 : 1}
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
