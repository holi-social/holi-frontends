import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import HoliImage from '@holi//ui/components/atoms/HoliImage'
import ImagePanZoom from '@holi/core/screens/posts/components/ImagePanZoom'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalFullscreen from '@holi/ui/components/molecules/HoliModalFullscreen'
import { colors } from '@holi/ui/styles/globalVars'

export type PostImageProps = {
  uri: string
  postTitle: string
}

const PostImage: React.VFC<PostImageProps> = ({ uri, postTitle }) => {
  const { t } = useTranslation()
  const [showFullscreenImage, setShowFullscreenImage] = useState(false)

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
        <HoliImage source={{ uri }} label={t('insights.posts.image', { title: postTitle })} style={styles.postImage} />
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
