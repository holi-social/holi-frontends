import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, type ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { Spacing } from 'holi-bricks/foundations'

type ImagePreviewProps = {
  style?: ViewStyle
  image?: HoliImageInfo | null
  currentImage?: string // used for edit mode - when we only have a uri and no HoliImageInfo
  imageUrl?: string // used for uploaded images from ImageKit
  blurhash?: string
  aspectRatio?: number
}

const ImagePreview = ({ style, image, currentImage, imageUrl, blurhash, aspectRatio = 16 / 9 }: ImagePreviewProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [imageError, setImageError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const styles = createStyles(theme, aspectRatio)

  return (
    <View>
      {!imageError && isLoading && (
        <View style={[styles.image, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
          <HoliSkeleton width={'100%'} height={'100%'} borderRadius={Spacing['3xs']} />
        </View>
      )}
      {(image || currentImage || imageUrl) && (
        <View style={[styles.container, style]}>
          {!imageError && image && (
            <HoliImage
              label={t('global.imagePreview.image')}
              source={image}
              resizeMode="cover"
              style={styles.image}
              blurhash={blurhash}
              onError={() => setImageError(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          )}
          {!imageError && !image && currentImage && (
            <HoliImage
              label={t('global.imagePreview.image')}
              source={{ uri: currentImage }}
              resizeMode="cover"
              style={styles.image}
              blurhash={blurhash}
              onError={() => setImageError(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          )}
          {!imageError && !image && !currentImage && imageUrl && (
            <HoliImage
              label={t('global.imagePreview.image')}
              source={{ uri: imageUrl }}
              resizeMode="cover"
              style={styles.image}
              blurhash={blurhash}
              onError={() => setImageError(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          )}
          {imageError && (
            <View style={[styles.image, styles.error]}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_link_preview_empty.svg')}
                width={72}
                height={72}
                label=""
                isSvg
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const createStyles = (theme: HoliTheme, aspectRatio: number) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    image: {
      aspectRatio: aspectRatio,
      borderRadius: Spacing['3xs'],
      width: '100%',
    },
    error: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background30,
    },
  })

export default ImagePreview
