import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliImage from '@holi//ui/components/atoms/HoliImage'

export type ImagePanZoomProps = {
  uri: string
  postTitle: string
}

const ImagePanZoom: React.VFC<ImagePanZoomProps> = ({ uri, postTitle }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.webModalImageContainer}>
      <HoliImage
        style={styles.webModalImage}
        source={{ uri }}
        label={t('insights.posts.image.modal', { title: postTitle })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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

export default ImagePanZoom
