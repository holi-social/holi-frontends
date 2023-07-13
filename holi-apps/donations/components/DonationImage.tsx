import React from 'react'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { MobileImageProps, ResizeMode, WebImageProps } from '@holi/ui/components/atoms/HoliImage/types'

import { Picture } from '@holi-apps/donations/typings'

type DonationImageProps = {
  picture: Picture[]
  label: string
  style?: MobileImageProps['style'] & WebImageProps['style']
  resizeMode?: ResizeMode
  // required for scaling down the image, will be multiplied by pixel density
  width: number
  // use when you also already know the height (e.g. squares, aspect ratio), will be multiplied by pixel density
  height?: number
}

const DonationImage: React.FC<DonationImageProps> = ({
  picture,
  label,
  style,
  resizeMode,
  width,
  height,
}: DonationImageProps) => {
  // we can't crop + fill mismatching required width+height combinations to the source images with the betterplace api,
  // so we use the original on our image service
  const original = picture.find(({ type }) => type === 'original')

  return (
    <HoliImage
      source={original ? { uri: original?.url, width, height } : []}
      label={label}
      style={style}
      resizeMode={resizeMode}
    />
  )
}

export default DonationImage
