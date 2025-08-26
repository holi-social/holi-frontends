import type React from 'react'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import type { MobileImageProps, ResizeMode, WebImageProps } from '@holi/ui/components/atoms/HoliImage/types'

import { Picture } from '@holi-apps/donations/typings'

type DonationImageProps = {
  imageUrl?: string
  label: string
  style?: MobileImageProps['style'] & WebImageProps['style']
  resizeMode?: ResizeMode
  // required for scaling down the image, will be multiplied by pixel density
  width: number
  // use when you also already know the height (e.g. squares, aspect ratio), will be multiplied by pixel density
  height?: number
}

const DonationImage: React.FC<DonationImageProps> = ({
  imageUrl,
  label,
  style,
  resizeMode,
  width,
  height,
}: DonationImageProps) => {
  return (
    <HoliImage
      source={imageUrl ? { uri: imageUrl, width, height } : []}
      label={label}
      style={style}
      resizeMode={resizeMode}
    />
  )
}

export default DonationImage
