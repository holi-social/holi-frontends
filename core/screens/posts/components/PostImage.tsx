import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { getSizes, getTransformedImageUri, useContainerSizeForImage } from '@holi/core/helpers'
import ImagePanZoom from '@holi/core/screens/posts/components/ImagePanZoom'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalFullscreen from '@holi/ui/components/molecules/HoliModalFullscreen'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  style?: StyleProp<ViewStyle>
  uri: string
  imageBlurhash?: string
  height: number
  width: number
  postTitle: string
}

const POST_IMAGE_SIZES: { breakpoint: number; width: number }[] = [
  {
    breakpoint: dimensions.breakpointXs,
    width: dimensions.breakpointXs - 40,
  },
  {
    breakpoint: dimensions.breakpointS,
    width: dimensions.breakpointS - 40,
  },
  {
    breakpoint: dimensions.breakpointM,
    width: dimensions.breakpointM - 40,
  },
  {
    breakpoint: dimensions.breakpointL,
    width: dimensions.breakpointL / 2 - 12,
  },
  {
    breakpoint: dimensions.breakpointXl,
    width: dimensions.breakpointXl / 2 - 12,
  },
]

const PostImage: React.FC<PropsWithSkeleton<Props>> = ({ loading, uri, imageBlurhash, width, height, postTitle }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [showFullscreenImage, setShowFullscreenImage] = useState(false)
  const imageSrcSet = POST_IMAGE_SIZES.map((transformSize) =>
    getTransformedImageUri({
      imageUri: uri ?? '',
      imageSize: { width: width ?? 0, height: height ?? 0 },
      transformSize,
      aspectRatio: '343-236',
    })
  )
  const imageSizes = getSizes(POST_IMAGE_SIZES)
  const { uri: mobileImageUri, onLayout } = useContainerSizeForImage(uri ?? '', true)

  const showImageFullScreen = useCallback(() => {
    setShowFullscreenImage(true)
  }, [setShowFullscreenImage])

  const hideFullscreenImage = useCallback(() => {
    setShowFullscreenImage(false)
  }, [setShowFullscreenImage])

  if (loading) return <HoliSkeleton aspectRatio={343 / 236} borderRadius={16} height={'auto'} width={'100%'} />

  return (
    <>
      <HoliButton
        label={t('insights.posts.image.show', { title: postTitle })}
        inline
        transparent
        onPress={showImageFullScreen}
        testID="post-image"
      >
        <HoliImage
          source={Platform.OS === 'web' ? imageSrcSet : { uri: mobileImageUri }}
          blurhash={imageBlurhash}
          sizes={imageSizes}
          label={t('insights.posts.image', { title: postTitle })}
          style={styles.postImage}
          onLayout={onLayout}
        />
      </HoliButton>

      <HoliModalFullscreen
        label={t('insights.posts.image.modal', { title: postTitle })}
        show={showFullscreenImage}
        onDismiss={hideFullscreenImage}
        testID="post-image-modal"
      >
        <ImagePanZoom uri={uri} postTitle={postTitle} blurhash={imageBlurhash} />
      </HoliModalFullscreen>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    postImage: {
      aspectRatio: 343 / 236,
      backgroundColor: theme.colors.background30,
      marginTop: 26,
      width: '100%',
    },
    webModalImageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    webModalImage: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  })

export default PostImage
