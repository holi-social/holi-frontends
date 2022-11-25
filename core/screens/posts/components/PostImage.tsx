import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'

import HoliImage from '@holi//ui/components/atoms/HoliImage'
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
  const [imageSize, setImageSize] = useState(() => ({ width: 0, height: 0 }))

  const showImageFullScreen = useCallback(() => {
    // find image's size for ImageZoom mobile component
    !(Platform.OS === 'web') &&
      Image.getSize(uri, (width, height) => {
        const multiplier = Math.min(Dimensions.get('window').width / width, Dimensions.get('window').height / height, 1)
        setImageSize({ width: width * multiplier, height: height * multiplier })
      })

    setShowFullscreenImage(true)
  }, [uri, setShowFullscreenImage])

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
        {Platform.OS === 'web' ? (
          <View style={styles.webModalImageContainer}>
            <HoliImage
              style={styles.webModalImage}
              source={{ uri }}
              label={t('insights.posts.image.modal', { title: postTitle })}
            />
          </View>
        ) : (
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={imageSize.width}
            imageHeight={imageSize.height}
          >
            <HoliImage
              style={{ width: '100%', height: '100%' }}
              source={{ uri }}
              label={t('insights.posts.image.modal', { title: postTitle })}
            />
          </ImageZoom>
        )}
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
