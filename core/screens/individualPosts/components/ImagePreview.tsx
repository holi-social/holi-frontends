import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'

type ImagePreviewProps = {
  style?: ViewStyle
  image?: HoliImageInfo | null
  currentImage?: string // used for edit mode - when we only have a uri and no HoliImageInfo
  blurhash?: string
  aspectRatio?: number
}

const ImagePreview = ({ style, image, currentImage, blurhash, aspectRatio = 16 / 9 }: ImagePreviewProps) => {
  const { t } = useTranslation()
  const styles = createStyles(aspectRatio)

  return (
    <>
      {(image || currentImage) && (
        <View style={[styles.container, style]}>
          {image && (
            <HoliImage
              label={t('global.imagePreview.image')}
              source={image}
              resizeMode="cover"
              style={styles.image}
              blurhash={blurhash}
            />
          )}
          {!image && currentImage && (
            <HoliImage
              label={t('global.imagePreview.image')}
              source={{ uri: currentImage }}
              resizeMode="cover"
              style={styles.image}
              blurhash={blurhash}
            />
          )}
        </View>
      )}
    </>
  )
}

const createStyles = (aspectRatio: number) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    image: {
      aspectRatio: aspectRatio,
      borderRadius: 8,
      width: '100%',
    },
  })

export default ImagePreview
