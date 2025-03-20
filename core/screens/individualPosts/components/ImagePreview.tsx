import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, type ViewStyle } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { Spacing } from 'holi-bricks/tokens'

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
  const [isLoading, setIsLoading] = React.useState(true)
  const styles = createStyles(theme, aspectRatio)

  return (
    <View>
      <View style={[styles.container, styles.image, style]}>
        {!imageError && isLoading && <HoliSkeleton width={'100%'} height={'100%'} borderRadius={Spacing['3xs']} />}
        {(image || currentImage) && !imageError && (
          <>
            {image && (
              <HoliImage
                label={t('global.imagePreview.image')}
                source={image}
                resizeMode="cover"
                style={[StyleSheet.absoluteFill, styles.image]}
                blurhash={blurhash}
                onError={() => setImageError(true)}
                onLoadEnd={() => setIsLoading(false)}
              />
            )}
            {!image && currentImage && (
              <HoliImage
                label={t('global.imagePreview.image')}
                source={{ uri: currentImage }}
                resizeMode="cover"
                style={[StyleSheet.absoluteFill, styles.image]}
                blurhash={blurhash}
                onError={() => setImageError(true)}
                onLoadEnd={() => setIsLoading(false)}
              />
            )}
          </>
        )}
        {imageError && (
          <View style={[StyleSheet.absoluteFill, styles.error]}>
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
