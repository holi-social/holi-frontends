import React from 'react'
import { Image } from 'react-native'
// TODO: "no exported member" !!!!!!!!!!!!!!!!!!!!
// https://github.com/react-native-svg/react-native-svg/pull/1443
// @ts-ignore
import { WithLocalSvg } from 'react-native-svg'

// Usage:
// <SharedImage imageFile={PngLogo} style={{ width: 30, height: 30 }} altText="some alt text" />
// <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} style={{ width: 50, height: 50 }} altText="some alt text" />

type StyleType = Record<string, string | number> & {
  width?: number
  height?: number
}
interface SharedImageProps {
  imageFile: number
  altText: string
  isSvg?: boolean
  style?: StyleType
}

// TODO: use this implementation to distinguish between require() and {uri: 'http:someImageurl'}
// https://gist.github.com/cryser29/9320f782562af06fb06082b1fce29094
const SharedImage: React.VoidFunctionComponent<SharedImageProps> = (props: SharedImageProps) => {
  const { imageFile, style: { width = 50, height = 50 } = {}, isSvg } = props

  return isSvg ? (
    <Image {...props} source={imageFile as number} style={{ overflow: 'visible' }} />
  ) : (
    <WithLocalSvg {...props} asset={imageFile} width={width} height={height} />
  )
}

export default SharedImage
