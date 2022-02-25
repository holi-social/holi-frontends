import React from 'react'
import Image from 'next/image'

// Usage:
// import SharedImage from "shared/components/sharedImage.web"
// import SvgLogo from 'shared/assets/img/logo/logo.svg'
// import PngLogo from 'shared/assets/img/logo/Logo_img.png'
// <SharedImage imageFile={SvgLogo.src} style={{ width: 50, height: 50 }} />
// <SharedImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} />

type sharedImageProps = {
  imageFile: string,
  altText?: string,
  style?: object
}

const SharedImage: React.FC<sharedImageProps> = (props: sharedImageProps) => {

  return <Image src={props.imageFile} alt={props.altText} width="50" height="50" />
}

export default SharedImage
