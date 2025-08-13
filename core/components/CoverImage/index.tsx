import type React from 'react'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import type { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'

interface CoverImageProps {
  coverImage?: ImageSource
}

const bannerImage = {
  ...Platform.select({
    web: {
      maxHeight: '30vh',
      objectFit: 'cover',
      objectPosition: 'center',
    },
    native: { maxHeight: '50%' },
  }),
}

export const CoverImageSkeleton = () => {
  return (
    <View style={[styles.container, bannerImage]}>
      <View style={styles.image}>
        <HoliSkeleton height="100%" width="100%" borderRadius={0} />
      </View>
    </View>
  )
}

export const CoverImage = ({ coverImage }: CoverImageProps) => {
  return coverImage ? (
    <HoliImageBackground
      source={coverImage}
      resizeMode="cover"
      style={[styles.container, bannerImage]}
      imageStyle={[
        styles.image,
        {
          ...Platform.select({
            web: {
              width: '100%',
              height: '100%',
            },
          }),
        },
      ]}
    />
  ) : null
}

const styles = StyleSheet.create(() => {
  return {
    container: {
      paddingHorizontal: 0,
      overflow: 'hidden',
      position: 'relative',
      aspectRatio: 375 / 212,
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
  }
})
CoverImage.displayName = 'CoverImage'
