import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import HoliImage from '@holi//ui/components/atoms/HoliImage'
import { getSizes, getTransformedImageUri, useContainerSizeForImage } from '@holi/core/helpers'
import ImagePanZoom from '@holi/core/screens/posts/components/ImagePanZoom'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalFullscreen from '@holi/ui/components/molecules/HoliModalFullscreen'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type PostImageProps = {
  uri: string
  height: number
  width: number
  postTitle: string
}

const POST_IMAGE_SIZES: { breakpoint: number; width: number }[] = [
  {
    breakpoint: +vars.breakpointXs,
    width: +vars.breakpointXs - 40,
  },
  {
    breakpoint: +vars.breakpointS,
    width: +vars.breakpointS - 40,
  },
  {
    breakpoint: +vars.breakpointM,
    width: +vars.breakpointM - 40,
  },
  {
    breakpoint: +vars.breakpointL,
    width: +vars.breakpointL / 2 - 12,
  },
  {
    breakpoint: +vars.breakpointXl,
    width: +vars.breakpointXl / 2 - 12,
  },
]

const PostImage: React.VFC<PostImageProps> = ({ uri, width, height, postTitle }) => {
  const { t } = useTranslation()
  const [showFullscreenImage, setShowFullscreenImage] = useState(false)
  const imageSrcSet = POST_IMAGE_SIZES.map((transformSize) =>
    getTransformedImageUri({
      imageUri: uri,
      imageSize: { width, height },
      transformSize,
      aspectRatio: '343-236',
    })
  )
  const imageSizes = getSizes(POST_IMAGE_SIZES)
  const { uri: mobileImageUri, onLayout } = useContainerSizeForImage(uri, true)

  const showImageFullScreen = useCallback(() => {
    setShowFullscreenImage(true)
  }, [setShowFullscreenImage])

  const hideFullscreenImage = useCallback(() => {
    setShowFullscreenImage(false)
  }, [setShowFullscreenImage])

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
        <ImagePanZoom uri={uri} postTitle={postTitle} />
      </HoliModalFullscreen>
    </>
  )
}

const styles = StyleSheet.create({
  postImage: {
    aspectRatio: 343 / 236,
    backgroundColor: colors.backgroundColorGreyLight,
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
