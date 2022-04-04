import React from 'react'
import { Image } from 'react-native'

// TODO: "no exported member" !!!!!!!!!!!!!!!!!!!!
// https://github.com/react-native-svg/react-native-svg/pull/1443
// @ts-ignore
import { WithLocalSvg } from 'react-native-svg'

// Usage:
// <SharedImage imageFile={PngLogo} style={{ width: 30, height: 30 }} />
// <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} isSvg={true} style={{ width: 50, height: 50 }} />

type StyleType = Record<string, string | number> & {
  width?: number
  height?: number
}
interface SharedImageProps {
  imageFile: number
  isSvg?: boolean
  style?: StyleType
}

const SharedImage: React.VoidFunctionComponent<SharedImageProps> = (props: SharedImageProps) => {
  const imageComponent = () => <Image {...props} source={props.imageFile as number} />

  const svgComponent = () => (
    <WithLocalSvg
      {...props}
      asset={props.imageFile}
      width={props.style && props.style.width ? props.style.width : 50}
      height={props.style && props.style.height ? props.style.height : 50}
    />
  )

  return props.isSvg ? svgComponent() : imageComponent()
}

export default SharedImage
