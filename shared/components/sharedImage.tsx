import React from 'react'
import { Image } from 'react-native'

// TODO: "no exported member" !!!!!!!!!!!!!!!!!!!!
import { WithLocalSvg } from "react-native-svg"

// Usage:
// <SharedImage imageFile={PngLogo} style={{ width: 30, height: 30 }} />
// <SharedImage imageFile={require('shared/assets/img/logo/logo.svg')} isSvg={true} style={{ width: 50, height: 50 }} />


interface styeType {
  width?: number
  height?: number
  [key: string]: any
}
interface sharedImageProps {
  imageFile: number
  isSvg?: boolean
  style?: styeType
}

const SharedImage: React.FC<sharedImageProps> = (props: sharedImageProps) => {

  const imageComponent = () => (
    <Image {...props} source={props.imageFile as number} />
  )

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
