import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type ImagePreviewProps = {
  style?: ViewStyle
  image?: HoliImageInfo | null
  currentImage?: string // used for edit mode - when we only have a uri and no HoliImageInfo
  blurhash?: string
  aspectRatio?: number
}

const ImagePreview = ({ style, image, currentImage, blurhash, aspectRatio = 16 / 9 }: ImagePreviewProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [imageError, setImageError] = React.useState(false)
  const styles = createStyles(theme, aspectRatio)

  return (
    <>
      {(image || currentImage) && (
        <View style={[styles.container, style]}>
          {!imageError && image && (
            <HoliImage
              label={t('global.imagePreview.image')}
              source={image}
              resizeMode="cover"
              style={styles.image}
              blurhash={blurhash}
              onError={() => setImageError(true)}
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
            />
          )}
          {imageError && (
            <View style={[styles.image, styles.error]}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_link_preview_empty.svg')}
                width={100}
                height={100}
                label=""
                isSvg
              />
            </View>
          )}
        </View>
      )}
    </>
  )
}

const createStyles = (theme: HoliTheme, aspectRatio: number) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    image: {
      aspectRatio: aspectRatio,
      borderRadius: 8,
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
