import type React from 'react'
import { Platform, View } from 'react-native'
import { HoliImageBackground } from '@holi/ui/components/molecules/HoliImageBackground'
import type { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
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
  const { styles } = useStyles(stylesheet)
  return (
    <View style={[styles.container, bannerImage]}>
      <View style={styles.image}>
        <HoliSkeleton height="100%" width="100%" borderRadius={0} />
      </View>
    </View>
  )
}

export const CoverImage = ({ coverImage }: CoverImageProps) => {
  const { styles } = useStyles(stylesheet)

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

const stylesheet = createStyleSheet(() => {
  return {
    container: {
      paddingHorizontal: 0,
      paddingTop: Platform.OS === 'web' ? '56.6%' : 340,
      overflow: 'hidden',
      position: 'relative',
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
