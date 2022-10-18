import React from 'react'
import { ImageStyle, StyleProp } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { ImageSource } from '@holi/ui/components/atoms/HoliImage.shared'
import { ResizeMode } from '@holi/ui/components/atoms/imageUtils'

import { Picture } from '@holi-apps/donations/typings'

type DonationImageProps = {
  picture: Picture[]
  label: string
  style?: StyleProp<ImageStyle>
  resizeMode?: ResizeMode
}

const DonationImage: React.VFC<DonationImageProps> = ({ picture, label, style, resizeMode }: DonationImageProps) => {
  const sources: ImageSource[] = picture
    .filter((picture) => !!picture.width && !!picture.height)
    .map((picture) => ({
      uri: picture.url,
      // We already ensure the size above
      width: picture.width || 0,
      height: picture.height || 0,
    }))
  const original = picture.find(({ type }) => type === 'original')

  return (
    <HoliImage
      source={sources.length ? sources : { uri: original?.url }}
      label={label}
      style={style}
      resizeMode={resizeMode}
    />
  )
}

export default DonationImage
