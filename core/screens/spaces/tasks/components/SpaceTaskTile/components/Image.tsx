import React, { PropsWithChildren, memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { HoliCardComponent, ImageCaptionProps, ImageProps } from '@holi/ui/components/molecules/HoliCard'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type Variant = 'full' | 'recommendation' | 'list'

export interface Props extends Pick<ImageProps, 'imageAspectRatio' | 'imageBlurhash' | 'imageWidth' | 'testID'> {
  imageUrl?: string
  imageHeight: number
  captionPosition?: ImageCaptionProps['position']
}

const FALLBACK_NATIVE_IMAGE_SIZE = { width: 296, height: 166 }
const getFallbackImageSize = (width: number, height: number) => {
  if (Platform.OS !== 'web') return FALLBACK_NATIVE_IMAGE_SIZE

  const nativeAspectRatio = FALLBACK_NATIVE_IMAGE_SIZE.width / FALLBACK_NATIVE_IMAGE_SIZE.height
  const goalAspectRatio = width / height

  return goalAspectRatio > nativeAspectRatio
    ? {
        height,
        width: height * nativeAspectRatio,
      }
    : {
        width,
        height: width / nativeAspectRatio,
      }
}

export const Image = ({
  imageUrl,
  imageWidth,
  imageHeight,
  imageAspectRatio = 1.5,
  ...props
}: PropsWithChildren<Props>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const [imageContainerSize, setImageContainerSize] = useState({ width: 0, height: 0 })

  const styles = useMemo(() => getStyles(theme), [theme])
  const [imageError, setImageError] = useState(false)

  return (
    <HoliCardComponent.ImageContainer>
      {!!imageUrl && !imageError ? (
        <HoliCardComponent.Image
          {...props}
          imageUri={imageUrl}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          imageAspectRatio={imageAspectRatio}
          imageLabel={t('spaces.tasks.thumbnail.label')}
          onError={() => setImageError(true)}
        />
      ) : (
        <View
          style={[styles.image, styles.fallbackImage, { aspectRatio: imageAspectRatio }]}
          onLayout={(event) =>
            setImageContainerSize(getFallbackImageSize(event.nativeEvent.layout.width, event.nativeEvent.layout.height))
          }
        >
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_task.svg')}
            label={t('spaces.tasks.thumbnail.label')}
            isSvg
            height={imageContainerSize.height}
            width={imageContainerSize.width}
            style={styles.image}
          />
        </View>
      )}

      <HoliCardComponent.ImageCaption position={props.captionPosition}>{props.children}</HoliCardComponent.ImageCaption>
    </HoliCardComponent.ImageContainer>
  )
}

export default memo(Image)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    image: {
      justifyContent: 'center',
    },
    fallbackImage: {
      backgroundColor: theme.colors.background20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
