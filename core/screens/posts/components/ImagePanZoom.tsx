import type React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Image } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'

import HoliImage from '@holi/ui/components/atoms/HoliImage'

export type ImagePanZoomProps = {
  uri: string
  postTitle: string
  blurhash?: string
}

const ImagePanZoom: React.FC<ImagePanZoomProps> = ({ uri, postTitle, blurhash }) => {
  const { t } = useTranslation()
  const [imageSize, setImageSize] = useState(() => ({ width: 0, height: 0 }))

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      const multiplier = Math.min(Dimensions.get('window').width / width, Dimensions.get('window').height / height, 1)
      setImageSize({ width: width * multiplier, height: height * multiplier })
    })
  }, [uri])

  return (
    // @ts-ignore Outdated type definition & not maintained anymore
    <ImageZoom
      cropWidth={Dimensions.get('window').width}
      cropHeight={Dimensions.get('window').height}
      imageWidth={imageSize.width}
      imageHeight={imageSize.height}
    >
      <HoliImage
        style={{ width: '100%', height: '100%' }}
        source={{ uri }}
        blurhash={blurhash}
        label={t('insights.posts.image.modal', { title: postTitle })}
      />
    </ImageZoom>
  )
}

export default ImagePanZoom
